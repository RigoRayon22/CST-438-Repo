import { initDatabase, addUser, getAllUsers, updateUser, deleteUser, deleteAllUsers } from './database';

// setup and cleanup for test's
beforeEach(async () => {
  await initDatabase();
  await deleteAllUsers(); // start with a new database
});

describe('Database CRUD Operations', () => {
  
  test('addUser should create a new user', async () => {
    const userId = await addUser('Test User', 'test@email.com');
    expect(userId).toBeGreaterThan(0);
    
    const users = await getAllUsers();
    expect(users.length).toBe(1);
    expect((users[0] as any).name).toBe('Test User');
    expect((users[0] as any).email).toBe('test@email.com');
  });

  test('getAllUsers should return empty array when no users', async () => {
    const users = await getAllUsers();
    expect(users).toEqual([]);
  });

  test('updateUser should modify existing user', async () => {
    const userId = await addUser('Original Name', 'original@email.com');
    const changes = await updateUser(userId, 'Updated Name', 'updated@email.com');
    
    expect(changes).toBe(1);
    
    const users = await getAllUsers();
    expect((users[0] as any).name).toBe('Updated Name');
    expect((users[0] as any).email).toBe('updated@email.com');
  });

  test('deleteUser should remove existing user', async () => {
    const userId = await addUser('Test User', 'test@email.com');
    const changes = await deleteUser(userId);
    
    expect(changes).toBe(1);
    
    const users = await getAllUsers();
    expect(users.length).toBe(0);
  });

});