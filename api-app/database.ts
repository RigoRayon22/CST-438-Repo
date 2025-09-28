import * as SQLite from 'expo-sqlite';

// Types
export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface UserSession {
  id: number;
  user_id: number;
  created_at: string;
}

// Database instance
let db: SQLite.SQLiteDatabase;

// Initialize database and create tables
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('echohub.db');
    
    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_sessions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default test users if they don't exist
    const userCountResult = await db.getFirstAsync('SELECT COUNT(*) as count FROM users');
    const userCount = (userCountResult as { count: number }).count;
    
    if (userCount === 0) {
      await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['alice', 'password123']
      );
      await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['bob', 'password123']
      );
      console.log('Default test users created');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (username: string, password: string): Promise<number> => {
  try {
    // Validate input
    if (!username?.trim() || !password) {
      throw new Error('Username and password are required');
    }
    
    if (username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    const trimmedUsername = username.trim();
    
    // Check if username already exists
    const existingUser = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [trimmedUsername]
    );
    
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Create user
    const result = await db.runAsync(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [trimmedUsername, password]
    );
    
    const userId = result.lastInsertRowId;
    if (!userId) {
      throw new Error('Failed to create user');
    }
    
    console.log(`User created successfully: ${trimmedUsername} (ID: ${userId})`);
    return userId;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    if (!username?.trim()) {
      return null;
    }
    
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username.trim()]
    );
    
    return (result as User) || null;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    if (!userId) {
      return null;
    }
    
    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    
    return (result as User) || null;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};

// Save user session
export const saveUserSession = async (userId: number): Promise<number> => {
  try {
    // Clear any existing sessions for this user
    await db.runAsync('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
    
    // Create new session
    const result = await db.runAsync(
      'INSERT INTO user_sessions (user_id) VALUES (?)',
      [userId]
    );
    
    const sessionId = result.lastInsertRowId;
    if (!sessionId) {
      throw new Error('Failed to create session');
    }
    
    console.log(`User session created for user ID: ${userId}`);
    return sessionId;
  } catch (error) {
    console.error('Error in saveUserSession:', error);
    throw error;
  }
};

// Get current user session
export const getCurrentUserSession = async (): Promise<UserSession | null> => {
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM user_sessions ORDER BY created_at DESC LIMIT 1'
    );
    
    return (result as UserSession) || null;
  } catch (error) {
    console.error('Error in getCurrentUserSession:', error);
    throw error;
  }
};

// Clear all sessions
export const clearAllSessions = async (): Promise<boolean> => {
  try {
    const result = await db.runAsync('DELETE FROM user_sessions');
    console.log(`Cleared ${result.changes} sessions`);
    return true;
  } catch (error) {
    console.error('Error in clearAllSessions:', error);
    throw error;
  }
};

// Authenticate user
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    if (!username?.trim() || !password) {
      return null;
    }
    
    const user = await getUserByUsername(username.trim());
    if (!user || user.password !== password) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};