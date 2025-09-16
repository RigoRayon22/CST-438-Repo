console.log('Database functions imported:', { addUser, showAllUsers });

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { initDatabase, addUser, showAllUsers, updateUser, deleteUser, deleteAllUsers, getAllUsers } from './src/db/database';
import { config } from './config';  
import { exportDatabaseData } from './src/db/database';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      setReady(true);
    };
    setup();
  }, []);

  const testCreate = async () => {
    await addUser('John Doe', 'john@example.com');
    await addUser('Jane Smith', 'jane@example.com');
  };

  const testRead = async () => {
    await showAllUsers();
  };

  const testUpdate = async () => {
    const users = await getAllUsers();
    if (users.length > 0) {
      const firstUser = users[0];
      await updateUser((firstUser as any).id, 'John Updated', 'johnupdated@example.com');
      await showAllUsers();
    } else {
      console.log('No users to update');
    }
  };

  const testDelete = async () => {
    const users = await getAllUsers();
    if (users.length > 1) {
      const secondUser = users[1];
      await deleteUser((secondUser as any).id);
      await showAllUsers();
    } else {
      console.log('Need at least 2 users to delete the second one');
    }
  };

  const testDeleteAll = async () => {
    await deleteAllUsers();
  };

  if (!ready) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD Test</Text>
      
      <Button title="1. Add Users" onPress={testCreate} />
      <Button title="2. Show All Users" onPress={testRead} />
      <Button title="3. Update User 1" onPress={testUpdate} />
      <Button title="4. Delete User 2" onPress={testDelete} />
      <Button title="5. Delete All Users" onPress={testDeleteAll} />
      <Button title="Export Data" onPress={exportDatabaseData} />

      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});