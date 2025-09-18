import * as SQLite from 'expo-sqlite';

// Open database using the correct API for the current version
const db = SQLite.openDatabaseSync('echohub.db');

// Define types
interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

// Initialize database tables
export async function initDatabase(): Promise<void> {
  try {
    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Insert default users if they don't exist
    await db.runAsync(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?), (?, ?)',
      ['alice', 'pass123', 'bob', 'hunter2']
    );

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const result = await db.getFirstAsync<User>(
      'SELECT * FROM users WHERE username = ? COLLATE NOCASE',
      [username]
    );
    return result || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// Save user session to database
export async function saveUserSession(userId: number): Promise<void> {
  try {
    await db.runAsync('INSERT INTO sessions (user_id) VALUES (?)', [userId]);
    console.log('User session saved');
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

// Get current user session (most recent)
export async function getCurrentUserSession(): Promise<{ user_id: number } | null> {
  try {
    const result = await db.getFirstAsync<{ user_id: number }>(
      'SELECT user_id FROM sessions ORDER BY login_time DESC LIMIT 1'
    );
    return result || null;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
}

// Clear all sessions (logout all)
export async function clearAllSessions(): Promise<void> {
  try {
    await db.runAsync('DELETE FROM sessions');
    console.log('All sessions cleared');
  } catch (error) {
    console.error('Error clearing sessions:', error);
    throw error;
  }
}