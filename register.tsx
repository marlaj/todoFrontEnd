import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      console.log('Please fill in all fields');
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      console.log('Please enter a valid email address');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      setErrorMessage('Passwords do not match');
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    fetch('http://192.168.1.4:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message == 'Email already exists'){
          setErrorMessage(data.message);
        }
        else{
          console.log(data.message); // Registration successful message
          console.log(data.user); // User data returned by the server
          navigation.navigate('Login'); // Navigate to the login page
        }
      })
      .catch((error) => {
        console.error('Registration failed', error);
      });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Register" onPress={handleRegister} />
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

export default RegisterScreen;
