import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*(.+)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
function normalizeLevel(raw) {
  if (!raw) return 'HSK 1';
  const m = String(raw).trim().toUpperCase().match(/HSK\s*([1-6])/);
  if (m) return `HSK ${m[1]}`;
  return 'HSK 1';
}

function detectTone(pinyin) {
  if (!pinyin) return 1;
  const p = pinyin.toLowerCase();
  if (/[āēīōūǖ]/.test(p)) return 1;
  if (/[áéíóúǘ]/.test(p)) return 2;
  if (/[ǎěǐǒǔǚ]/.test(p)) return 3;
  if (/[àèìòùǜ]/.test(p)) return 4;
  return 1;
}

async function fetchAll(table, selectFields) {
  let allRows = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      break;
    }
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < pageSize) break;
    page++;
  }
  return allRows;
}

async function runImport() {
  console.log('🚀 Starting import from D:\\Code\\Github\\tu_vung_hsk1-5_dot3.xlsx ...');

  const excelPath = 'D:/Code/Github/tu_vung_hsk1-5_dot3.xlsx';
  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets['Tu_Vung'] || wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(sheet);
  console.log(`📊 Read ${rawRows.length} rows from Excel sheet [Tu_Vung].`);

  // 1. Fetch current state from Supabase
  console.log('\n🔍 Fetching existing data from Supabase...');
  const existingVocab = await fetchAll('vocabularies', 'id, hanzi, level');
  const existingPairs = await fetchAll('game_match_pairs', 'id, hanzi, category');
  const existingTones = await fetchAll('game_tone_items', 'id, char');

  console.log(`  - Existing vocabularies: ${existingVocab.length}`);
  console.log(`  - Existing game_match_pairs: ${existingPairs.length}`);
  console.log(`  - Existing game_tone_items: ${existingTones.length}`);

  const existingVocabIds = new Set(existingVocab.map(v => (v.id || '').trim()));
  const existingVocabHanzi = new Set(existingVocab.map(v => (v.hanzi || '').trim()));

  const existingPairIds = new Set(existingPairs.map(p => (p.id || '').trim()));
  const existingPairHanzi = new Set(existingPairs.map(p => (p.hanzi || '').trim()));

  const existingToneIds = new Set(existingTones.map(t => (t.id || '').trim()));
  const existingToneChars = new Set(existingTones.map(t => (t.char || '').trim()));

  // 2. Prepare records
  const toInsertVocab = [];
  const skippedVocab = [];

  const toInsertPairs = [];
  const skippedPairs = [];

  const toInsertTones = [];
  const skippedTones = [];

  const fullVocabList = []; // All 712 items for hskVocabularyData.js

  rawRows.forEach((row, idx) => {
    const rawId = (row.Ma_Tu_Vung || `TV-${idx + 1}`).trim();
    const level = normalizeLevel(row.Cap_Do_HSK);
    const hanzi = (row.Han_Tu || '').trim();
    const pinyin = (row.Pinyin || '').trim();
    const wordType = (row.Loai_Tu || '').trim();
    const meaning = (row.Nghia_Tieng_Viet || '').trim();
    const topic = (row.Chu_De || 'Chung').trim();
    const exampleHanzi = (row.Cau_Vi_Du_Han || '').trim();
    const exampleMeaning = (row.Cau_Vi_Du_Dich || '').trim();
    const note = (row.Ghi_Chu || '').trim();
    const isSingleChar = hanzi.length === 1;
    const tone = isSingleChar ? detectTone(pinyin) : null;

    if (!hanzi) return;

    fullVocabList.push({
      id: rawId,
      level,
      topic,
      hanzi,
      pinyin,
      wordType,
      mean: meaning,
      exampleHanzi,
      exampleMean: exampleMeaning,
      note,
      isSingleChar,
      tone
    });

    // Check Vocabularies
    if (existingVocabIds.has(rawId) || existingVocabHanzi.has(hanzi)) {
      skippedVocab.push(hanzi);
    } else {
      toInsertVocab.push({
        id: rawId,
        level,
        topic,
        hanzi,
        pinyin,
        word_type: wordType,
        meaning,
        example_hanzi: exampleHanzi,
        example_meaning: exampleMeaning,
        note
      });
      // Mark as existing so later duplicates in same run are prevented
      existingVocabIds.add(rawId);
      existingVocabHanzi.add(hanzi);
    }

    // Check game_match_pairs
    const pairId = `pair-${rawId}`;
    if (existingPairIds.has(pairId) || existingPairHanzi.has(hanzi)) {
      skippedPairs.push(hanzi);
    } else {
      toInsertPairs.push({
        id: pairId,
        hanzi,
        pinyin,
        mean: meaning,
        category: level
      });
      existingPairIds.add(pairId);
      existingPairHanzi.add(hanzi);
    }

    // Check game_tone_items (only single characters)
    if (isSingleChar && tone) {
      const toneId = `tone-${rawId}`;
      if (existingToneIds.has(toneId) || existingToneChars.has(hanzi)) {
        skippedTones.push(hanzi);
      } else {
        toInsertTones.push({
          id: toneId,
          char: hanzi,
          pinyin,
          tone,
          mean: `[${level}] ${meaning}`
        });
        existingToneIds.add(toneId);
        existingToneChars.add(hanzi);
      }
    }
  });

  console.log(`\n📋 Filter summary:`);
  console.log(`  - Vocabularies: ${toInsertVocab.length} new to insert, ${skippedVocab.length} skipped`);
  console.log(`  - Match Pairs: ${toInsertPairs.length} new to insert, ${skippedPairs.length} skipped`);
  console.log(`  - Tone Items: ${toInsertTones.length} new to insert, ${skippedTones.length} skipped`);

  // 3. Insert into Supabase table: vocabularies
  if (toInsertVocab.length > 0) {
    console.log(`\n💾 Inserting ${toInsertVocab.length} records into public.vocabularies...`);
    const chunkSize = 50;
    for (let i = 0; i < toInsertVocab.length; i += chunkSize) {
      const chunk = toInsertVocab.slice(i, i + chunkSize);
      const { error } = await supabase.from('vocabularies').insert(chunk);
      if (error) {
        console.error(`  ❌ Error inserting vocabularies chunk ${i}-${i + chunk.length}:`, error.message);
      } else {
        console.log(`  ✓ Inserted vocabularies chunk ${i + 1} to ${i + chunk.length}`);
      }
    }
  }

  // 4. Insert into Supabase table: game_match_pairs
  if (toInsertPairs.length > 0) {
    console.log(`\n🎮 Inserting ${toInsertPairs.length} records into public.game_match_pairs...`);
    const chunkSize = 50;
    for (let i = 0; i < toInsertPairs.length; i += chunkSize) {
      const chunk = toInsertPairs.slice(i, i + chunkSize);
      const { error } = await supabase.from('game_match_pairs').insert(chunk);
      if (error) {
        console.error(`  ❌ Error inserting match pairs chunk ${i}-${i + chunk.length}:`, error.message);
      } else {
        console.log(`  ✓ Inserted match pairs chunk ${i + 1} to ${i + chunk.length}`);
      }
    }
  }

  // 5. Insert into Supabase table: game_tone_items
  if (toInsertTones.length > 0) {
    console.log(`\n🎵 Inserting ${toInsertTones.length} records into public.game_tone_items...`);
    const chunkSize = 50;
    for (let i = 0; i < toInsertTones.length; i += chunkSize) {
      const chunk = toInsertTones.slice(i, i + chunkSize);
      const { error } = await supabase.from('game_tone_items').insert(chunk);
      if (error) {
        console.error(`  ❌ Error inserting tone items chunk ${i}-${i + chunk.length}:`, error.message);
      } else {
        console.log(`  ✓ Inserted tone items chunk ${i + 1} to ${i + chunk.length}`);
      }
    }
  }

  // 6. Verify updated counts
  console.log('\n📊 Verifying final counts on Supabase:');
  const finalVocab = await fetchAll('vocabularies', 'id, level');
  const finalPairs = await fetchAll('game_match_pairs', 'id, category');
  const finalTones = await fetchAll('game_tone_items', 'id');

  console.log(`  ✓ public.vocabularies total: ${finalVocab.length}`);
  console.log(`  ✓ public.game_match_pairs total: ${finalPairs.length}`);
  console.log(`  ✓ public.game_tone_items total: ${finalTones.length}`);

  const vocabLevels = {};
  finalVocab.forEach(v => {
    vocabLevels[v.level] = (vocabLevels[v.level] || 0) + 1;
  });
  console.log('  Vocabulary breakdown by level in DB:', vocabLevels);

  const pairCategories = {};
  finalPairs.forEach(p => {
    pairCategories[p.category] = (pairCategories[p.category] || 0) + 1;
  });
  console.log('  Match Pairs breakdown by level in DB:', pairCategories);

  // 7. Update local hskVocabularyData.js
  console.log('\n📝 Updating src/data/hskVocabularyData.js with full 712 words...');
  const jsContent = `// src/data/hskVocabularyData.js
// Kho từ vựng chuẩn HSK 1 - HSK 6 nạp từ tu_vung_hsk1-5_dot3.xlsx
// Bao gồm đầy đủ ${fullVocabList.length} từ vựng phân cấp HSK 1 đến HSK 6 với câu ví dụ song ngữ

export const HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];

export const HSK_VOCABULARY_LIST = ${JSON.stringify(fullVocabList, null, 2)};

export function getVocabulariesByLevel(level = 'all') {
  if (level === 'all') return HSK_VOCABULARY_LIST;
  return HSK_VOCABULARY_LIST.filter((item) => item.level === level);
}

export function getAvailableTopics(level = 'all') {
  const list = getVocabulariesByLevel(level);
  const topics = new Set(list.map((item) => item.topic).filter(Boolean));
  return Array.from(topics);
}

export function getRandomVocabularies(level = 'all', count = 8) {
  const pool = getVocabulariesByLevel(level);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomGamePairs(level = 'HSK 1', count = 8) {
  const pool = getVocabulariesByLevel(level);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item, idx) => ({
    id: \`pair-\${level.toLowerCase().replace(/\\s+/g, '')}-\${item.id || idx}\`,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    mean: item.mean,
    category: item.level
  }));
}

export function getRandomToneItems(level = 'HSK 1', count = 10) {
  const pool = HSK_VOCABULARY_LIST.filter(
    (item) => (level === 'all' || item.level === level) && item.isSingleChar && item.tone
  );
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item) => ({
    char: item.hanzi,
    pinyin: item.pinyin,
    tone: item.tone,
    mean: \`[\${item.level}] \${item.mean}\`
  }));
}
`;

  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'hskVocabularyData.js'), jsContent, 'utf8');
  console.log('  ✓ Updated src/data/hskVocabularyData.js');

  // 8. Update supabase/vocabularies.sql
  console.log('\n📝 Updating supabase/vocabularies.sql...');
  const sqlLines = [
    '-- ==============================================================================',
    '-- BẢNG TỪ VỰNG TIẾNG TRUNG THEO CẤP ĐỘ HSK 1 ĐẾN HSK 6 (VOCABULARIES)',
    '-- Chạy file này trên Supabase SQL Editor',
    '-- ==============================================================================',
    'CREATE TABLE IF NOT EXISTS public.vocabularies (',
    '  id TEXT PRIMARY KEY,',
    '  level TEXT NOT NULL CHECK (level IN (\'HSK 1\', \'HSK 2\', \'HSK 3\', \'HSK 4\', \'HSK 5\', \'HSK 6\')),',
    '  topic TEXT,',
    '  hanzi TEXT NOT NULL,',
    '  pinyin TEXT NOT NULL,',
    '  word_type TEXT,',
    '  meaning TEXT NOT NULL,',
    '  example_hanzi TEXT,',
    '  example_meaning TEXT,',
    '  note TEXT,',
    '  created_at TIMESTAMPTZ DEFAULT timezone(\'utc\'::text, now()) NOT NULL',
    ');',
    '',
    'CREATE INDEX IF NOT EXISTS idx_vocabularies_level ON public.vocabularies(level);',
    'CREATE INDEX IF NOT EXISTS idx_vocabularies_topic ON public.vocabularies(topic);',
    'CREATE INDEX IF NOT EXISTS idx_vocabularies_hanzi ON public.vocabularies(hanzi);',
    '',
    'ALTER TABLE public.vocabularies ENABLE ROW LEVEL SECURITY;',
    'CREATE POLICY "Cho phép xem từ vựng công khai" ON public.vocabularies FOR SELECT USING (true);',
    'CREATE POLICY "Cho phép staff quản lý từ vựng" ON public.vocabularies FOR ALL USING (true);',
    '',
    `-- DỮ LIỆU TỪ VỰNG (${fullVocabList.length} TỪ)`,
    'INSERT INTO public.vocabularies (id, level, topic, hanzi, pinyin, word_type, meaning, example_hanzi, example_meaning, note)',
    'VALUES'
  ];

  const valRows = fullVocabList.map(v => {
    const esc = (val) => {
      if (!val) return 'NULL';
      const s = String(val).replace(/'/g, "''");
      return `'${s}'`;
    };
    return `  (${esc(v.id)}, ${esc(v.level)}, ${esc(v.topic)}, ${esc(v.hanzi)}, ${esc(v.pinyin)}, ${esc(v.wordType)}, ${esc(v.mean)}, ${esc(v.exampleHanzi)}, ${esc(v.exampleMean)}, ${esc(v.note)})`;
  });

  sqlLines.push(valRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET');
  sqlLines.push('  level = EXCLUDED.level, topic = EXCLUDED.topic, hanzi = EXCLUDED.hanzi, pinyin = EXCLUDED.pinyin,');
  sqlLines.push('  word_type = EXCLUDED.word_type, meaning = EXCLUDED.meaning, example_hanzi = EXCLUDED.example_hanzi,');
  sqlLines.push('  example_meaning = EXCLUDED.example_meaning, note = EXCLUDED.note;');

  fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'vocabularies.sql'), sqlLines.join('\n'), 'utf8');
  console.log('  ✓ Updated supabase/vocabularies.sql');

  console.log('\n✨ ALL TASKS COMPLETED SUCCESSFULLY! ✨');
}

runImport().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
