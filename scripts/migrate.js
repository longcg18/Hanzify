import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const PROJECT_REF = 'vwuikidgncknuozufiyi';
const DB_PASSWORD = 'ThuHoai1409';

// Connection candidates (ap-northeast-2 Seoul region)
const connectionCandidates = [
  // 1. Session mode port 5432 (ideal for DDL / migrations)
  {
    name: 'Supabase Pooler ap-northeast-2 Session Mode (Port 5432)',
    config: {
      host: 'aws-0-ap-northeast-2.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    }
  },
  // 2. Transaction mode port 6543
  {
    name: 'Supabase Pooler ap-northeast-2 Transaction Mode (Port 6543)',
    config: {
      host: 'aws-0-ap-northeast-2.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    }
  }
];

async function runMigration() {
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  console.log('📖 Reading schema file from:', schemaPath);
  const sql = fs.readFileSync(schemaPath, 'utf8');

  let connectedClient = null;

  for (const candidate of connectionCandidates) {
    console.log(`\n🔄 Attempting connection via: ${candidate.name}...`);
    const client = new Client(candidate.config);
    try {
      await client.connect();
      console.log(`✅ Connected successfully via: ${candidate.name}`);
      connectedClient = client;
      break;
    } catch (err) {
      console.log(`❌ Failed connecting via ${candidate.name}: ${err.message}`);
      await client.end().catch(() => {});
    }
  }

  if (!connectedClient) {
    console.error('\n❌ Could not connect via any available host. Please check database network or pooler region.');
    process.exit(1);
  }

  try {
    console.log('\n🚀 Executing schema.sql migration on Supabase PostgreSQL...');
    await connectedClient.query(sql);
    console.log('🎉 Migration executed successfully!');

    // Verify created tables
    console.log('\n📊 Verifying table contents:');
    const tables = [
      'users',
      'courses',
      'lessons',
      'homework_questions',
      'submissions',
      'game_match_pairs',
      'game_tone_items',
      'game_leaderboard',
      'exams',
      'exam_skills',
      'exam_parts',
      'exam_questions'
    ];

    for (const t of tables) {
      try {
        const res = await connectedClient.query(`SELECT count(*) FROM public.${t}`);
        console.log(`  ✓ Table public.${t}: ${res.rows[0].count} rows`);
      } catch (err) {
        console.log(`  ⚠ Table public.${t}: ${err.message}`);
      }
    }

    console.log('\n🌟 ALL TABLES CREATED AND SEEDED ON SUPABASE SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error executing SQL:', err);
  } finally {
    await connectedClient.end();
  }
}

runMigration();
