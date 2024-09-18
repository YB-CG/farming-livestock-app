import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, Image, Dimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../contexts/AuthContext';
import { register } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import FlashMessage from '../components/FlashMessage';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useContext(AuthContext);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    setIsLoading(true);
    setFlashMessage(null);
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const response = await register({ email, password, first_name, last_name });
      signUp(response.data.access);
      navigation.navigate('Login');
    } catch (error) {
      setFlashMessage({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/grass-background.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 80 })}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Create Account</Text>
                {flashMessage && (
                  <FlashMessage type={flashMessage.type} message={flashMessage.message} />
                )}
                <View style={styles.formContainer}>
                <Input
                    label="First name"
                    value={first_name}
                    onChangeText={setFirstname}
                    placeholder="Enter your firstname"
                    keyboardType="first_name"
                    style={styles.input}
                  />
                  <Input
                    label="Last name"
                    value={last_name}
                    onChangeText={setLastname}
                    placeholder="Enter your lastname"
                    keyboardType="last_name"
                    style={styles.input}
                  />
                  <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    style={styles.input}
                  />
                  <PasswordStrengthIndicator password={password} />
                  <Input
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                    style={styles.input}
                  />
                  <Button title="Create Account" onPress={handleRegister} style={styles.createAccountButton} />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}>Already have an account? Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
      {isLoading && <Loader />}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: -20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: '#FF5722',
    marginBottom: 10,
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: '#7CB342',
    width: '100%',
    height: 56,
    borderRadius: 28,
    marginTop: 10,
  },
  link: {
    color: '#0000FF',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default RegisterScreen;
