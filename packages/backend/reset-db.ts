import { db } from './src/db/index.js'

async function resetDatabase() {
  console.log('Dropping existing tables...')
  
  try {
    // Drop tables in correct order (respecting foreign keys)
    await db.execute('DROP TABLE IF EXISTS notes CASCADE')
    await db.execute('DROP TABLE IF EXISTS campaigns CASCADE')
    await db.execute('DROP TABLE IF EXISTS "verification" CASCADE')
    await db.execute('DROP TABLE IF EXISTS "account" CASCADE')
    await db.execute('DROP TABLE IF EXISTS "session" CASCADE')
    await db.execute('DROP TABLE IF EXISTS "user" CASCADE')
    
    console.log('Tables dropped successfully!')
    console.log('Run "pnpm db:push" to recreate tables with the new schema.')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
  
  process.exit(0)
}

resetDatabase()
