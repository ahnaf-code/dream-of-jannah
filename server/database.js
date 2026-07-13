import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.db');

export async function getDbConnection() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function initDatabase() {
  const db = await getDbConnection();

  // Create kids table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS kids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create tasks table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      points INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create task completions table
  // Store date as 'YYYY-MM-DD'
  await db.exec(`
    CREATE TABLE IF NOT EXISTS task_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kid_id INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      completed_date TEXT NOT NULL,
      points_earned INTEGER NOT NULL,
      FOREIGN KEY (kid_id) REFERENCES kids (id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  // Create champions table (monthly Hall of Fame)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS champions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL, -- e.g., "July 2026"
      champion_name TEXT NOT NULL,
      champion_avatar TEXT NOT NULL,
      champion_points INTEGER NOT NULL,
      runner_up_name TEXT,
      runner_up_avatar TEXT,
      runner_up_points INTEGER,
      declared_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if default tasks exist; if not, populate them
  const existingTasks = await db.all('SELECT * FROM tasks');
  if (existingTasks.length === 0) {
    const defaultTasks = [
      { title: 'Practice my daily prayers 🕌', points: 15 },
      { title: 'Read an inspiring story or verse 📖', points: 15 },
      { title: 'Be kind and help Mom & Dad 💖', points: 10 },
      { title: 'Brush my teeth morning and night 🦷', points: 10 },
      { title: 'Keep my room neat and tidy 🧹', points: 10 },
      { title: 'Do my homework or study diligently 📝', points: 15 },
      { title: 'Share something with others 🧸', points: 10 }
    ];

    for (const task of defaultTasks) {
      await db.run('INSERT INTO tasks (title, points) VALUES (?, ?)', [task.title, task.points]);
    }
    console.log('Prepopulated Jannah Deed Tasks successfully!');
  }

  // Prepopulate a couple of demo kids if none exist, just to make starting easy and cute!
  const existingKids = await db.all('SELECT * FROM kids');
  if (existingKids.length === 0) {
    const defaultKids = [
      { name: 'Mariam', avatar: 'lavender-pegasus', points: 45 },
      { name: 'Amina', avatar: 'mint-kitten', points: 30 },
      { name: 'Zaynab', avatar: 'magic-butterfly', points: 50 }
    ];

    for (const kid of defaultKids) {
      await db.run('INSERT INTO kids (name, avatar, points) VALUES (?, ?, ?)', [kid.name, kid.avatar, kid.points]);
    }

    // Prepopulate some completions to show active state
    const todayStr = new Date().toISOString().split('T')[0];
    await db.run('INSERT INTO task_completions (kid_id, task_id, completed_date, points_earned) VALUES (1, 1, ?, 15)', [todayStr]);
    await db.run('INSERT INTO task_completions (kid_id, task_id, completed_date, points_earned) VALUES (3, 2, ?, 15)', [todayStr]);
    
    console.log('Prepopulated starter kids with beautiful avatars!');
  }

  await db.close();
  console.log('SQLite database initialized successfully.');
}
