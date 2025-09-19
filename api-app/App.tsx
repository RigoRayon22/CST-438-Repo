import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import React, { useState, useEffect } from 'react';
import { initDatabase } from './src/db/database'; // init db
import LoginScreen from './src/pages/LoginPage'; // Import your LoginScreen component
import SignUpScreen from './src/pages/SignUpPage'; // Import your SignUpScreen component

//TO DO: add login/authentication functionality
/** Main app component setting up navigation */
export function App() {

  // Initialize database when app starts
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'app'>('login');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleLoginSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app'); // Go directly to main app after login
  };

  const handleSignUpSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app'); // Go directly to main app after signup
  };

  const handleGoToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  // Show signup screen
  if (currentScreen === 'signup') {
    return (
      <SignUpScreen 
        onSuccess={handleSignUpSuccess}
        onGoToLogin={handleGoToLogin}
      />
    );
  }

  // Show login screen
  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onSuccess={handleLoginSuccess}
        onGoToSignUp={handleGoToSignUp}
      />
    );
  }

  // Show main app navigation after successful login/signup
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

