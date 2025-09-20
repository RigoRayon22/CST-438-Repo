// App.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import LoginPage from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignupPage';

/** Main app component setting up navigation */
export function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'app'>('app');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleLoginSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app');
  };

  const handleSignUpSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setCurrentScreen('app');
  };

  const handleGoToSignUp = () => setCurrentScreen('signup');
  const handleGoToLogin = () => setCurrentScreen('login');

  if (currentScreen === 'signup') {
    return <SignUpPage onSuccess={handleSignUpSuccess} onGoToLogin={handleGoToLogin} />;
  }

  if (currentScreen === 'login') {
    return <LoginPage onSuccess={handleLoginSuccess} onGoToSignUp={handleGoToSignUp} />;
  }

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

