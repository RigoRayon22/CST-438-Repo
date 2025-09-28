import { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  initDatabase, 
  getUserByUsername, 
  getUserById,
  createUser,
  saveUserSession, 
  getCurrentUserSession, 
  clearAllSessions 
} from './database';

type User = { id: number; username: string; password: string };

const APP_TAG = 'ECHOHUB';

// SignUpScreen Component
function SignUpScreen({
  onSuccess,
  onGoToSignIn,
}: {
  onSuccess?: (userId: number) => void | Promise<void>;
  onGoToSignIn?: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndCreateUser = async () => {
    // Validation
    if (!username.trim()) {
      showToast('Username cannot be blank');
      return;
    }
    
    if (username.trim().length < 3) {
      showToast('Username must be at least 3 characters long');
      return;
    }
    
    if (!password) {
      showToast('Password cannot be blank');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Check if username already exists
      const existingUser = await getUserByUsername(username.trim());
      if (existingUser) {
        showToast('Username already exists. Please choose a different one.');
        return;
      }

      // Create new user
      const userId = await createUser(username.trim(), password);
      await saveUserSession(userId);
      showToast('Account created successfully!');
      await onSuccess?.(userId);
    } catch (error) {
      console.error('Sign up error:', error);
      showToast('Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.brand}>EchoHub</Text>
        <Text style={s.heading}>Create Account</Text>

        <View style={s.field}>
          <Text style={s.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter username (min 3 characters)"
            style={s.input}
            returnKeyType="next"
            editable={!isLoading}
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter password (min 6 characters)"
            style={s.input}
            returnKeyType="next"
            editable={!isLoading}
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>Confirm Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm your password"
            style={s.input}
            returnKeyType="done"
            onSubmitEditing={validateAndCreateUser}
            editable={!isLoading}
          />
        </View>

        <Pressable 
          style={[s.button, isLoading && s.buttonDisabled]} 
          onPress={validateAndCreateUser} 
          accessibilityLabel="Create account"
          disabled={isLoading}
        >
          <Text style={s.buttonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </Pressable>

        <Pressable onPress={onGoToSignIn} style={s.link} disabled={isLoading}>
          <Text style={s.linkText}>Already have an account? Sign in here</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  const [isLoading, setIsLoading] = useState(false);

  const authenticateUser = async () => {
    if (!username.trim()) {
      showToast('Username cannot be blank');
      return;
    }
    
    if (!password) {
      showToast('Password cannot be blank');
      return;
    }
    
    setIsLoading(true);
    try {
      const user = await getUserByUsername(username.trim());
      
      if (!user) {
        showToast(`No account found for username: ${username}`);
        return;
      }
      
      if (password !== user.password) {
        showToast('Invalid password. Please try again.');
        return;
      }

      await saveUserSession(user.id);
      showToast('Signed in successfully!');
      await onSuccess?.(user.id);
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          placeholder="Enter your username"
          style={s.input}
          returnKeyType="next"
          editable={!isLoading}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          style={s.input}
          returnKeyType="done"
          onSubmitEditing={authenticateUser}
          editable={!isLoading}
        />
      </View>

      <Pressable 
        style={[s.button, isLoading && s.buttonDisabled]} 
        onPress={authenticateUser} 
        accessibilityLabel="Sign in"
        disabled={isLoading}
      >
        <Text style={s.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Text>
      </Pressable>

      <Pressable onPress={onGoToSignUp} style={s.link} disabled={isLoading}>
        <Text style={s.linkText}>Don't have an account? Sign up here</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      
      const session = await getCurrentUserSession();
      if (session) {
        const user = await getUserById(session.user_id);
        setCurrentUserId(session.user_id);
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      showToast('Failed to initialize app');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAuthSuccess = async (userId: number) => {
    try {
      // Get user details after successful auth
      const user = await getUserById(userId);
      setCurrentUserId(userId);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error setting user details:', error);
      setCurrentUserId(userId);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllSessions();
              setIsLoggedIn(false);
              setCurrentUserId(null);
              setCurrentUser(null);
              showToast('Logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              showToast('Logout failed');
            }
          },
        },
      ]
    );
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <SafeAreaView style={[s.safe, s.centerContent]}>
        <StatusBar style="dark" />
        <Text style={s.brand}>EchoHub</Text>
        <Text style={s.heading}>Initializing...</Text>
        <View style={s.loadingIndicator} />
      </SafeAreaView>
    );
  }

  // Show authentication screens if not logged in
  if (!isLoggedIn) {
    return authMode === 'login' ? (
      <LoginScreen 
        onSuccess={handleAuthSuccess}
        onGoToSignUp={switchAuthMode}
      />
    ) : (
      <SignUpScreen 
        onSuccess={handleAuthSuccess}
        onGoToSignIn={switchAuthMode}
      />
    );
  }

  // Show main app after successful authentication
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.welcomeContainer}>
        <Text style={s.welcomeTitle}>Welcome to EchoHub!</Text>
        <Text style={s.welcomeText}>You're successfully authenticated</Text>
        
        <View style={s.userCard}>
          <Text style={s.userInfo}>User ID: {currentUserId}</Text>
          {currentUser && (
            <Text style={s.userInfo}>Username: {currentUser.username}</Text>
          )}
          <Text style={s.dbInfo}>✓ Using SQLite Database Storage</Text>
        </View>
        
        <View style={s.actionButtons}>
          <Pressable 
            style={s.secondaryButton} 
            onPress={() => showToast('Profile feature coming soon!')}
          >
            <Text style={s.secondaryButtonText}>View Profile</Text>
          </Pressable>
          
          <Pressable 
            style={s.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={s.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Helper function for showing alerts
function showToast(message: string) {
  if (Platform.OS === 'web') {
    // For web platform, use browser's alert
    (global as any).alert(message);
  } else {
    Alert.alert(APP_TAG, message);
  }
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: { 
    fontSize: 32, 
    fontWeight: '800' as const, 
    color: '#1f2937', 
    marginTop: 8,
    textAlign: 'center',
  },
  heading: { 
    fontSize: 24, 
    fontWeight: '800' as const, 
    color: '#111827',
    marginBottom: 8,
  },

  field: { gap: 6 },
  label: { fontWeight: '600' as const, color: '#374151', fontSize: 16 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    color: '#111827',
  },

  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700' as const, 
    fontSize: 16 
  },

  secondaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600' as const,
    fontSize: 16,
  },

  link: { 
    alignSelf: 'center', 
    padding: 12, 
    marginTop: 8 
  },
  linkText: { 
    color: '#2563eb', 
    fontWeight: '600' as const, 
    fontSize: 15,
    textAlign: 'center',
  },

  // Welcome screen styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  userCard: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
    minWidth: '80%',
  },
  userInfo: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500' as const,
  },
  dbInfo: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600' as const,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  logoutButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#e5e7eb',
    borderTopColor: '#1f2937',
    marginTop: 20,
  },
});