// src/pages/LoginPage.tsx
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

const APP_TAG = 'ECHOHUB';

type Props = {
  onSuccess?: (userId: number) => void | Promise<void>;
  onGoToSignUp?: () => void;
};

export default function LoginPage({ onSuccess, onGoToSignUp }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) return showToast('Username cannot be blank');
    if (!password.trim()) return showToast('Password cannot be blank');

    // Fake login for now (teammates will hook DB/auth later).
    // Use a deterministic fake id so you can test downstream behavior.
    const FAKE_USER_ID = 1;
    showToast('Signed in (fake) — welcome!');
    await onSuccess?.(FAKE_USER_ID);
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
          onSubmitEditing={handleLogin}
        />
      </View>

      <Pressable style={s.button} onPress={handleLogin} accessibilityLabel="Sign in">
        <Text style={s.buttonText}>Sign in</Text>
      </Pressable>

      <Pressable onPress={onGoToSignUp} style={s.link}>
        <Text style={s.linkText}>Don't have an account? Sign up here</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function showToast(message: string) {
  Alert.alert(APP_TAG, message);
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff', padding: 20, gap: 16, paddingTop: Platform.OS === 'android' ? 50 : 20 },
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
