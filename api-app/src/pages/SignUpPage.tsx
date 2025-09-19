import { useState } from 'react';
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
import { addUser } from '../db/database';

const APP_TAG = 'ECHOHUB';

// SignUp Component
function SignUpScreen({
  onSuccess,
  onGoToLogin,
}: {
  onSuccess?: (userId: number) => void | Promise<void>;
  onGoToLogin?: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle user registration
  const handleSignUp = async () => {
    try {
      // Basic validation
      if (!username.trim()) return showToast('Username cannot be blank');
      if (!password.trim()) return showToast('Password cannot be blank');
      
      // Add user to database with username and password
      const userId = await addUser(username.trim(), password.trim());
      
      showToast('Account created successfully!');
      await onSuccess?.(Number(userId));
      
    } catch (error) {
      console.error('Sign up error:', error);
      showToast('Sign up failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <Text style={s.brand}>EchoHub</Text>
      <Text style={s.heading}>Sign up</Text>

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
          onSubmitEditing={handleSignUp}
        />
      </View>

      {/* Sign up button */}
      <Pressable style={s.button} onPress={handleSignUp} accessibilityLabel="Sign up">
        <Text style={s.buttonText}>Sign up</Text>
      </Pressable>

      {/* Back to login link */}
      <Pressable onPress={onGoToLogin} style={s.link}>
        <Text style={s.linkText}>Already have an account? Sign in here</Text>
      </Pressable>
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
});

export default SignUpScreen;