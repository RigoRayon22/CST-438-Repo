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
// Import your database functions
import { getAllUsers } from '../db/database';

// Type for user from database
type User = { id: number; username: string; password: string };

const APP_TAG = 'ECHOHUB';

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
  const [users, setUsers] = useState<User[]>([]);

  // Find user by username from database users
  const userByName = useMemo(
    () =>
      users.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      ) ?? null,
    [username, users]
  );

  // Check user credentials
  const checkUser = async () => {
    try {
      // Get all users from database
      const dbUsers = await getAllUsers() as User[];
      setUsers(dbUsers);
      
      // Basic validation
      if (!username.trim()) return showToast('Username cannot be blank');
      if (!password.trim()) return showToast('Password cannot be blank');
      
      // Check if user exists in database
      const foundUser = dbUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );
      
      if (!foundUser) return showToast(`No user ${username} found`);
      
      // Check password
      if (password !== foundUser.password) return showToast('Invalid password');
      
      // Success!
      showToast('Signed in successfully!');
      await onSuccess?.(foundUser.id);
      
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <Text style={s.brand}>EchoHub</Text>
      <Text style={s.heading}>Sign in</Text>

      {/* Username input field */}
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

      {/* Password input field */}
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

      {/* Sign in button */}
      <Pressable style={s.button} onPress={checkUser} accessibilityLabel="Sign in">
        <Text style={s.buttonText}>Sign in</Text>
      </Pressable>

      {/* Sign up link */}
      <Pressable onPress={onGoToSignUp} style={s.link}>
        <Text style={s.linkText}>Don't have an account? Sign up here</Text>
      </Pressable>
      
      {/* Debug info - shows current users in database */}
      {users.length > 0 && (
        <View style={s.debugContainer}>
          <Text style={s.debugTitle}>Available Users:</Text>
          {users.map((user) => (
            <Text key={user.id} style={s.debugText}>
              Username: {user.username}
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

// Helper function to show alerts
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

  // Debug styles - shows available users
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default LoginScreen;