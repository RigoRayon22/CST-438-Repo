import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import React from 'react';
import { initDatabase } from './src/db/database';  // init db



//TO DO: add login/authentication functionality

/** Main app component setting up navigation */
export function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

/* had to run these commands in api-app directory to fix errors:
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-get-random-values react-native-vector-icons
npm install @react-navigation/stack @react-navigation/bottom-tabs */

