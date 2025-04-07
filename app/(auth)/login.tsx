import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { useState, useContext } from "react";
import { router } from 'expo-router';

import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/authService";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response) {
      setUser({ email: email });
      router.push("/(main)");
    } else {
      console.log("Login failed");
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/(auth)/register');
  };


  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Input placeholder="Password" value={password}
          onChangeText={setPassword}
        />
        <Button text="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={handleNavigateToRegister}>
          <Text style={styles.registerText}>
            Register here 
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
},
  form: {
    width: "100%",
    gap: 10,
},
  registerText: {
    textAlign: "center",
    marginTop: 10,
  },
});