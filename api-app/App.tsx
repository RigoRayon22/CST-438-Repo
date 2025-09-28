import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import React, { useState, useEffect } from 'react';
import { initDatabase } from './src/db/database';
import LoginScreen from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignupPage';
import { UserProvider } from './src/contexts/UserContext';

export function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'app'>('login');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleLoginSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app');
  };

  const handleSignUpSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app');
  };

  const handleGoToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'signup') {
    return (
      <SignUpPage 
        onSuccess={handleSignUpSuccess}
        onGoToLogin={handleGoToLogin}
      />
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onSuccess={handleLoginSuccess}
        onGoToSignUp={handleGoToSignUp}
      />
    );
  }

  return (
    <UserProvider userId={currentUserId}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
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
