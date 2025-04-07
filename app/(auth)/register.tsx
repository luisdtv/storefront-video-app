import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { register } from '../services/authService';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleRegister() {
    const user = await register(email, password);
    if (user) {
      setUser(user);
      console.log('success');
      router.replace('/(main)');
    } else {
      console.log('error');
    }
  }

  return (
    <Layout>
      <Text>Register</Text>
      <Input placeholder="email" value={email} onChangeText={setEmail} />
      <Input placeholder="password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleRegister} text="Register" />
    </Layout>
  );
}

export default Register;