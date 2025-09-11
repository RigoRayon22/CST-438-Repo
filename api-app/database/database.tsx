import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

//initialize and create user table

export const initDatabase = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('users.db');
  
  // user table with id that auto increments
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT
    );
  `);
  console.log('Database ready');
  return db;
};

export const getDatabase = () => {
  if (!db) throw new Error('Database not ready');
  return db;
};

// Create : adding users
export const addUser = async (name: string, email: string) => {
  const database = getDatabase();
  const result = await database.runAsync(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  console.log('User added with ID:', result.lastInsertRowId);
  return result.lastInsertRowId;
};

// Read : display users 
export const showAllUsers = async () => {
  const database = getDatabase();
  const users = await database.getAllAsync('SELECT * FROM users');
  console.log('\n=== USERS TABLE ===');
  if (users.length === 0) {
    console.log('No users found');
  } else {
    console.log('ID | Name | Email');
    console.log('---|------|------');
    users.forEach((user: any) => {
      console.log(`${user.id} | ${user.name} | ${user.email}`);
    });
  }
  console.log('==================\n');
};

// Getting user data
export const getAllUsers = async () => {
  const database = getDatabase();
  const users = await database.getAllAsync('SELECT * FROM users');
  return users;
};

// Updating existing user 
export const updateUser = async (id: number, name: string, email: string) => {
  const database = getDatabase();
  const result = await database.runAsync(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id]
  );
  console.log('User updated, rows affected:', result.changes);
  return result.changes;
};

// Delete user by ID
export const deleteUser = async (id: number) => {
  const database = getDatabase();
  const result = await database.runAsync('DELETE FROM users WHERE id = ?', [id]);
  console.log('User deleted, rows affected:', result.changes);
  return result.changes;
};

// Delete all
export const deleteAllUsers = async () => {
  const database = getDatabase();
  const result = await database.runAsync('DELETE FROM users');
  console.log('All users deleted, rows affected:', result.changes);
  return result.changes;
};