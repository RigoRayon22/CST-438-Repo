import * as SQLite from 'expo-sqlite';

// connection 
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('database.db');
};

export const initDatabase = async () => {
  const db = await openDatabase();
  try {
    //  users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    
    //  saved events table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL DEFAULT 1,
        event_id TEXT NOT NULL,
        event_data TEXT NOT NULL,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id)
      );
    `);
    console.log('Database tables initialized successfully');
  } finally {
    await db.closeAsync();
  }
};

// adding a new user 
export const addUser = async (username: string, password: string) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    console.log('User added with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error: any) {
    console.error('Add user error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username already exists. Please choose a different username.');
    }
    throw new Error('Failed to create account. Please try again.');
  } finally {
    await db.closeAsync();
  }
};

export const getUserByCredentials = async (username: string, password: string) => {
  const db = await openDatabase();
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    return user;
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
    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    const users = await db.getAllAsync('SELECT * FROM users');
    const savedEvents = await db.getAllAsync('SELECT event_id, user_id FROM saved_events');
    
    console.log('=== DATABASE SUMMARY ===');
    console.log(`Tables: ${tables.map((t: any) => t.name).join(', ')}`);
    console.log(`Users: ${users.length}`);
    console.log(`Total saved events: ${savedEvents.length}`);
    
    return { tables, users, savedEventsCount: savedEvents.length };
  } finally {
    await db.closeAsync();
  }
};

export const saveEventForUser = async (userId: number, eventId: string, eventData: any) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT OR REPLACE INTO saved_events (user_id, event_id, event_data) VALUES (?, ?, ?)',
      [userId, eventId, JSON.stringify(eventData)]
    );
    console.log(`✅ Saved: "${eventData.name}" (ID: ${eventId}) for user ${userId}`);
    return result.lastInsertRowId;
  } finally {
    await db.closeAsync();
  }
};

export const removeSavedEventForUser = async (userId: number, eventId: string) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'DELETE FROM saved_events WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );
    return result.changes;
  } finally {
    await db.closeAsync();
  }
};

export const getSavedEventsForUser = async (userId: number) => {
  const db = await openDatabase();
  try {
    const savedEvents = await db.getAllAsync(
      'SELECT * FROM saved_events WHERE user_id = ? ORDER BY saved_at DESC',
      [userId]
    );
    console.log(`📋 Found ${savedEvents.length} saved events for user ${userId}`);
    return savedEvents.map((row: any) => ({
      ...row,
      event_data: JSON.parse(row.event_data)
    }));
  } finally {
    await db.closeAsync();
  }
};