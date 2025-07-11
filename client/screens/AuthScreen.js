import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import styles from './AuthScreenStyle';
import { API_BASE } from '../apiConfig';

export default function AuthScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAuth = async () => {
    const newErrors = {};

    if (isRegistering) {
      if (!username) newErrors.username = 'Username is required';
      if (!email) newErrors.email = 'Email is required';
      else if (!email.includes('@')) newErrors.email = 'Invalid email format';
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else {
      if (!email) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const endpoint = isRegistering ? 'register' : 'login';
    const payload = isRegistering ? { username, email, password } : { email, password };

    try {
    const res = await axios.post(`${API_BASE}/${endpoint}`, payload);
      navigation.navigate('HomeScreen');
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Something went wrong' });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{isRegistering ? 'Sign Up' : 'Login'}</Text>
        </View>

        <View style={styles.formContainer}>
          {isRegistering && (
            <>
              <TextInput
                placeholder="User Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
              {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}
            </>
          )}

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

          {isRegistering && (
            <>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
            </>
          )}

          {errors.general && <Text style={{ color: 'red', textAlign: 'center' }}>{errors.general}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isRegistering ? 'Sign Up' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsRegistering(!isRegistering); setErrors({}); }}>
            <Text style={styles.toggleText}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.linkText}>{isRegistering ? 'Login' : 'Sign Up'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}