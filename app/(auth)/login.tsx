import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleLogin() {
    const user = await login(email, password);
    if (user) {
      setUser(user);
      router.replace('/(main)');
    } else {
      console.log('error');
    }
  }

  return (
    <Layout>
      <Text>Login</Text>
      <Input placeholder="email" value={email} onChangeText={setEmail} />
      <Input placeholder="password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleLogin} text="Login" />
      <Text onPress={() => router.push('/register')}>
        register here
      </Text>
    </Layout>
  );
}

export default Login;