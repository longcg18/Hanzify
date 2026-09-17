import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default;
const functionNodeTypes = new Set([
  'ArrowFunctionExpression',
  'FunctionDeclaration',
  'FunctionExpression'
]);

const sourceFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  if (entry.isDirectory()) return sourceFiles(target);
  return /\.(js|jsx)$/.test(entry.name) ? [target] : [];
});

const containsNode = (node, predicate, isRoot = true) => {
  if (!node || typeof node !== 'object') return false;
  if (!isRoot && functionNodeTypes.has(node.type)) return false;
  if (predicate(node)) return true;

  return Object.entries(node).some(([key, value]) => {
    if (['loc', 'start', 'end'].includes(key)) return false;
    if (Array.isArray(value)) return value.some((child) => containsNode(child, predicate, false));
    return containsNode(value, predicate, false);
  });
};

const isHookCall = (node) => {
  if (node?.type !== 'CallExpression') return false;
  if (node.callee.type === 'Identifier') return /^use[A-Z0-9]/.test(node.callee.name);
  return node.callee.type === 'MemberExpression'
    && node.callee.property?.type === 'Identifier'
    && /^use[A-Z0-9]/.test(node.callee.property.name);
};

test('React components never return before a later hook call', () => {
  const issues = [];

  sourceFiles(path.resolve('src')).forEach((file) => {
    const ast = parse(fs.readFileSync(file, 'utf8'), {
      sourceType: 'module',
      plugins: ['jsx']
    });

    traverse(ast, {
      Function(componentPath) {
        let name = componentPath.node.id?.name;
        if (!name && componentPath.parentPath.isVariableDeclarator() && componentPath.parent.id.type === 'Identifier') {
          name = componentPath.parent.id.name;
        }
        if (!name || !/^([A-Z]|use[A-Z])/.test(name) || componentPath.node.body.type !== 'BlockStatement') return;

        const statements = componentPath.node.body.body;
        statements.forEach((statement, index) => {
          if (!containsNode(statement, (node) => node.type === 'ReturnStatement')) return;
          const laterHook = statements.slice(index + 1).find((candidate) => containsNode(candidate, isHookCall));
          if (laterHook) {
            issues.push(`${path.relative(process.cwd(), file)}:${statement.loc?.start.line} (${name})`);
          }
        });
      }
    });
  });

  assert.deepEqual(issues, [], `Conditional render can freeze the UI by changing Hook order:\n${issues.join('\n')}`);
});
