import initSqlJs, { Database } from 'sql.js'

let dbPromise: Promise<Database> | null = null

export async function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.9.0/${file}` }).then((SQL) => {
      const saved = localStorage.getItem('sqliteDb')
      const db = saved
        ? new SQL.Database(Uint8Array.from(atob(saved), c => c.charCodeAt(0)))
        : new SQL.Database()
      db.run(`CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        email TEXT PRIMARY KEY,
        password TEXT,
        role TEXT,
        joinDate TEXT,
        courses TEXT,
        completedLessons TEXT
      );`)
      return db
    })
  }
  return dbPromise
}

export async function saveDb(db: Database) {
  const data = db.export()
  const b64 = btoa(String.fromCharCode(...data))
  localStorage.setItem('sqliteDb', b64)
}
