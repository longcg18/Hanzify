import fs from 'fs';
import path from 'path';

const files = [
  'src/views/CoursesView.jsx',
  'src/views/CourseDetailView.jsx',
  'src/views/PracticeView.jsx',
  'src/views/ExamView.jsx',
  'src/views/EntertainmentView.jsx',
  'src/views/LeaderboardView.jsx',
  'src/views/TeacherGradingView.jsx',
  'src/views/AdminUsersView.jsx',
  'src/views/ForumView.jsx'
];

let totalReplacements = 0;

for (const relPath of files) {
  const filePath = path.resolve(relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${relPath}`);
    continue;
  }

  let code = fs.readFileSync(filePath, 'utf8');
  const original = code;

  // 1. Replace #fee2e2 pink borders with clean neutral var(--border)
  code = code.replace(/#fee2e2/g, 'var(--border)');

  // 2. Replace linear-gradients on crimson buttons/cards with flat #b91c1c
  code = code.replace(/linear-gradient\(135deg,\s*#A11D24\s*0%,\s*#7f1d1d\s*100%\)/gi, '#b91c1c');
  code = code.replace(/linear-gradient\(135deg,\s*#7f1d1d\s*0%,\s*#b91c1c\s*100%\)/gi, '#b91c1c');
  code = code.replace(/linear-gradient\(135deg,\s*#94a3b8\s*0%,\s*#64748b\s*100%\)/gi, '#64748b');
  code = code.replace(/linear-gradient\(135deg,\s*#f59e0b\s*0%,\s*#d97706\s*100%\)/gi, '#d97706');
  code = code.replace(/linear-gradient\(180deg,\s*#fffbeb\s*0%,\s*#ffffff\s*100%\)/gi, '#fffdf5');
  code = code.replace(/linear-gradient\(180deg,\s*#fff5f5\s*0%,\s*#ffffff\s*100%\)/gi, '#ffffff');

  // 3. Remove red button and glow shadows (taste-skill: buttons have 0 shadow at rest)
  code = code.replace(/boxShadow:\s*'0 4px 12px rgba\(161,\s*29,\s*36,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 2px 8px rgba\(161,\s*29,\s*36,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 6px 15px rgba\(161,\s*29,\s*36,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 4px 10px rgba\(100,\s*116,\s*139,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 10px 25px -5px rgba\(100,\s*116,\s*139,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 15px 35px -5px rgba\(245,\s*158,\s*11,\s*0\.[0-9]+\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 8px 30px rgba\(0,\s*0,\s*0,\s*0\.03\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 6px 20px rgba\(0,\s*0,\s*0,\s*0\.02\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 4px 14px rgba\(0,\s*0,\s*0,\s*0\.25\)'/g, "boxShadow: 'none'");
  code = code.replace(/boxShadow:\s*'0 6px 24px rgba\(154,\s*52,\s*18,\s*0\.05\)'/g, "boxShadow: 'none'");

  // 4. Standardize old #A11D24 primary brand red to vibrant crimson #b91c1c in button backgrounds & active states
  code = code.replace(/background:\s*'#A11D24'/g, "background: '#b91c1c'");
  code = code.replace(/background:\s*#A11D24/g, "background: #b91c1c");
  code = code.replace(/border:\s*'1\.5px solid #A11D24'/g, "border: '1px solid #b91c1c'");
  code = code.replace(/border:\s*'2px solid #A11D24'/g, "border: '1px solid #b91c1c'");

  // 5. Standardize 20px / 24px card radii to 14px for cleaner modern layout
  code = code.replace(/borderRadius:\s*'20px'/g, "borderRadius: '14px'");
  code = code.replace(/borderRadius:\s*'24px'/g, "borderRadius: '16px'");
  code = code.replace(/borderRadius:\s*'18px'/g, "borderRadius: '12px'");

  if (code !== original) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated ${relPath}`);
    totalReplacements++;
  } else {
    console.log(`No changes needed for ${relPath}`);
  }
}

console.log(`Finished: ${totalReplacements} files updated.`);
