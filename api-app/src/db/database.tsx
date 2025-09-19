import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('database.db');
};

export const initDatabase = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log('Users table initialized with username and password');
  } finally {
    await db.closeAsync();
  }
};

export const addUser = async (username: string, password: string) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    console.log('User added with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } finally {
    await db.closeAsync();
  }
};

export const getAllUsers = async () => {
  const db = await openDatabase();
  try {
    const users = await db.getAllAsync('SELECT * FROM users');
    return users;
  } finally {
    await db.closeAsync();
  }
};

export const debugDatabase = async () => {
    const db = await openDatabase();
    try {
      // Check if tables exist
      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      console.log('All tables:', tables);
      
      // Check users table content
      const users = await db.getAllAsync('SELECT * FROM users');
      console.log('Users in database:', users);
      
      return { tables, users };
    } finally {
      await db.closeAsync();
    }
  };