// src/pages/SignUpPage.tsx
import React, { useState } from 'react';
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
import { addUser } from '../db/database'; // Add this import

const APP_TAG = 'ECHOHUB';

type Props = {
  onSuccess?: (userId: number) => void | Promise<void>;
  onGoToLogin?: () => void;
};

export default function SignUpPage({ onSuccess, onGoToLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      console.log('Attempting to create user:', username.trim());
      
      if (!username.trim()) return showToast('Username cannot be blank');
      if (!password.trim()) return showToast('Password cannot be blank');
      
      // Actually create user in database
      const userId = await addUser(username.trim(), password.trim());
      console.log('User created with ID:', userId);
      
      showToast('Account created successfully!');
      await onSuccess?.(Number(userId));
      
    } catch (error) {
      console.error('Sign up error details:', error);
      showToast('Sign up failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <Text style={s.brand}>EchoHub</Text>
      <Text style={s.heading}>Sign up</Text>
      
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
          onSubmitEditing={handleSignUp}
        />
      </View>
      
      <Pressable style={s.button} onPress={handleSignUp} accessibilityLabel="Sign up">
        <Text style={s.buttonText}>Sign up</Text>
      </Pressable>
      
      <Pressable onPress={onGoToLogin} style={s.link}>
        <Text style={s.linkText}>Already have an account? Sign in here</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function showToast(message: string) {
  Alert.alert(APP_TAG, message);
}

const s = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
    gap: 16, 
    paddingTop: Platform.OS === 'android' ? 50 : 20 
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
    marginTop: 4 
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { alignSelf: 'center', padding: 8 },
  linkText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
});