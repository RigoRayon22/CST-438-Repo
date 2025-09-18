import { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { id: number; username: string; password: string };

const APP_TAG = 'ECHOHUB';
const STORAGE_USER_ID = '@echohub_userId';

const USERS: User[] = [
  { id: 1, username: 'alice', password: 'pass123' },
  { id: 2, username: 'bob', password: 'hunter2' },
];

// LoginScreen Component
function LoginScreen({
  onSuccess,
  onGoToSignUp,
}: {
  onSuccess?: (userId: number) => void | Promise<void>;
  onGoToSignUp?: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userByName = useMemo(
    () =>
      USERS.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      ) ?? null,
    [username]
  );

  const checkUser = async () => {
    if (!username.trim()) return showToast('Username cannot be blank');
    if (!userByName) return showToast(`No ${username} found`);
    if (password !== userByName.password) return showToast('Invalid password');

    await persistUserId(userByName.id);
    showToast('Signed in successfully!');
    await onSuccess?.(userByName.id);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <Text style={s.brand}>EchoHub</Text>
      <Text style={s.heading}>Sign in</Text>

      <View style={s.field}>
        <Text style={s.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter username"
          style={s.input}
          returnKeyType="next"
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
          style={s.input}
          returnKeyType="done"
          onSubmitEditing={checkUser}
        />
      </View>

      <Pressable style={s.button} onPress={checkUser} accessibilityLabel="Sign in">
        <Text style={s.buttonText}>Sign in</Text>
      </Pressable>

      <Pressable onPress={onGoToSignUp} style={s.link}>
        <Text style={s.linkText}>Don't have an account? Sign up here</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// THIS IS THE MISSING MAIN APP COMPONENT - THIS IS CRUCIAL!
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleLoginSuccess = (userId: number) => {
    setCurrentUserId(userId);
    setIsLoggedIn(true);
  };

  const handleGoToSignUp = () => {
    Alert.alert('Sign Up', 'Sign up functionality coming soon!');
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onSuccess={handleLoginSuccess}
        onGoToSignUp={handleGoToSignUp}
      />
    );
  }

  // Show welcome screen after login
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.welcomeContainer}>
        <Text style={s.welcomeTitle}>Welcome to EchoHub!</Text>
        <Text style={s.welcomeText}>You're successfully logged in</Text>
        <Text style={s.userInfo}>User ID: {currentUserId}</Text>
        
        <Pressable 
          style={s.logoutButton} 
          onPress={() => {
            setIsLoggedIn(false);
            setCurrentUserId(null);
          }}
        >
          <Text style={s.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Helper functions
async function persistUserId(userId: number) {
  try {
    await AsyncStorage.setItem(STORAGE_USER_ID, String(userId));
  } catch (error) {
    console.warn('Failed to save user ID:', error);
  }
}

function showToast(message: string) {
  Alert.alert(APP_TAG, message);
}

// Styles
const s = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
    gap: 16,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  brand: { fontSize: 20, fontWeight: '800', color: '#111827', marginTop: 8 },
  heading: { fontSize: 24, fontWeight: '800', color: '#111827' },

  field: { gap: 6 },
  label: { fontWeight: '600', color: '#111827' },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },

  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  link: { alignSelf: 'center', padding: 8 },
  linkText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },

  // Welcome screen styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    color: '#374151',
    marginTop: 10,
  },
  logoutButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
});









