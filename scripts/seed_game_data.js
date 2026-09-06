// scripts/seed_game_data.js
import pg from 'pg';
import { MEMORY_PAIRS_BY_LEVEL, TONE_ITEMS_BY_LEVEL } from '../src/data/gamesData.js';

const { Client } = pg;
const PROJECT_REF = 'vwuikidgncknuozufiyi';
const DB_PASSWORD = 'ThuHoai1409';

const config = {
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: `postgres.${PROJECT_REF}`,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

async function seedGameData() {
  const client = new Client(config);
  try {
    console.log('🔄 Connecting to Supabase Cloud PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL successfully!\n');

    console.log('🧹 Clearing old game_match_pairs and game_tone_items...');
    await client.query('DELETE FROM public.game_match_pairs;');
    await client.query('DELETE FROM public.game_tone_items;');
    console.log('✅ Cleaned existing game tables.\n');

    // 1. Insert Memory Match pairs for HSK 1, 2, 3
    console.log('📝 Seeding game_match_pairs (Memory Match)...');
    let pairCount = 0;
    for (const [level, pairs] of Object.entries(MEMORY_PAIRS_BY_LEVEL)) {
      for (const p of pairs) {
        await client.query(
          `INSERT INTO public.game_match_pairs (id, hanzi, pinyin, mean, category)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            `pair-${level.toLowerCase().replace(/\s+/g, '')}-${p.id}`,
            p.hanzi,
            p.pinyin,
            p.mean,
            level
          ]
        );
        pairCount++;
      }
    }
    console.log(`✅ Seeded ${pairCount} match pairs across HSK 1, 2, 3 into Supabase.`);

    // 2. Insert Tone Blitz items for HSK 1, 2, 3
    console.log('📝 Seeding game_tone_items (Tone Blitz)...');
    let toneCount = 0;
    for (const [level, tones] of Object.entries(TONE_ITEMS_BY_LEVEL)) {
      for (const [idx, t] of tones.entries()) {
        await client.query(
          `INSERT INTO public.game_tone_items (id, char, pinyin, tone, mean)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            `tone-${level.toLowerCase().replace(/\s+/g, '')}-${idx + 1}`,
            t.char,
            t.pinyin,
            t.tone,
            `[${level}] ${t.mean}`
          ]
        );
        toneCount++;
      }
    }
    console.log(`✅ Seeded ${toneCount} tone questions across HSK 1, 2, 3 into Supabase.`);

    console.log('\n🎉 ALL GAME DATA SEEDED SUCCESSFULLY INTO SUPABASE!');
  } catch (err) {
    console.error('❌ Error seeding game data:', err);
  } finally {
    await client.end();
  }
}

seedGameData();
