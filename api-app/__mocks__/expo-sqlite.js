// mock data storage for unit tests
let users = [];

const mockDatabase = {
  execAsync: jest.fn(),
  
  runAsync: jest.fn((query, params) => {
    // CREATE - Add user
    if (query.includes('INSERT')) {
      users.push({ id: 1, name: params[0], email: params[1] });
      return Promise.resolve({ lastInsertRowId: 1, changes: 1 });
    }
    
    // UPDATE - Modify existing user
    if (query.includes('UPDATE')) {
      if (users.length > 0) {
        users[0] = { id: 1, name: params[0], email: params[1] };
        return Promise.resolve({ changes: 1 });
      }
      return Promise.resolve({ changes: 0 });
    }
    
    // DELETE - Remove users
    if (query.includes('DELETE')) {
      users = [];
      return Promise.resolve({ changes: 1 });
    }
    
    return Promise.resolve({ changes: 1 });
  }),
  
  getAllAsync: jest.fn(() => Promise.resolve([...users])),
};

module.exports = {
  openDatabaseAsync: jest.fn(() => Promise.resolve(mockDatabase)),
  __esModule: true,
};