import { View, Text } from 'react-native';
import React, { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { register } from '../../services/authService';

const RegisterScreen = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('Email:', email);
    register(email, password).then(res => {
      if(res){
        setUser({email: email})
        console.log('success')
      }else{
        console.error('error')
      }
    })
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, width: '100%' }}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, width: '100%' }}
      />
      <Button title="Register" onPress={handleRegister} />
    </Layout>
  );
};

export default RegisterScreen;