import test from 'node:test';
import assert from 'node:assert/strict';
import { officialExamSources } from '../scripts/official_exam_sources.js';

test('six published papers have full official answer keys and media URLs', () => {
  assert.equal(officialExamSources.length, 6);
  for (const source of officialExamSources) {
    const expected = source.level === 'HSK 1' ? 40 : source.level === 'HSK 2' ? 60 : 80;
    assert.equal(source.answers.length, expected, source.code);
    assert.match(source.pdfUrl, new RegExp(`${source.code}\\.pdf$`));
    assert.match(source.audioUrl, new RegExp(`${source.code}\\.mp3$`));
    assert.ok(source.answers.every(Boolean), source.code);
  }
});
