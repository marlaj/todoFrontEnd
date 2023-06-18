import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
let userInfo = {}
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      console.log('Please fill in all fields');
      setErrorMessage('Please fill in all fields');
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    fetch('http://192.168.1.2:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message == 'Invalid Email or Password'){
          setErrorMessage(data.message);
        }
        else{
          userInfo = data.user.email;
          console.log(data.user);
          navigation.navigate('Home', { email: userInfo });

        }
      })
      .catch((error) => {
        console.error('Login failed', error);
      });
  };

  const goToRegister = () => {
    navigation.navigate('Register');
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  return (
    
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={goToRegister} />
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#C4E0E5'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;