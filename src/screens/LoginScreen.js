import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, Image, Dimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import GoogleLogin from '../components/GoogleLogin';
import FlashMessage from '../components/FlashMessage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

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

  const validateInputs = () => {
    if (!email || !password) {
      setFlashMessage({
        type: 'error',
        message: 'Please enter both email and password.',
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFlashMessage({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
  
    setIsLoading(true);
    setFlashMessage(null);
    try {
      const response = await login(email, password);
      signIn(response.data.access, response.data.refresh); 
      // navigation.navigate('Home');

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setFlashMessage({
        type: 'error',
        message: error.response?.data?.message || 'Login failed. Please check your credentials and try again.',
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
                <Text style={styles.title}>Login</Text>
                {flashMessage && (
                  <FlashMessage type={flashMessage.type} message={flashMessage.message} />
                )}
                <View style={styles.formContainer}>
                  <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                  <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                  <Button title="Login" onPress={handleLogin} style={styles.loginButton} />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.link}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
                <View style={styles.socialContainer}>
                  <Text style={styles.orText}>Or</Text>
                  <GoogleLogin navigation={navigation} />
                </View>
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
    // Slightly lower the login card
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10, // Adjusted margin to position the card lower
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
  loginButton: {
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
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row', // Align logo and text horizontally
    backgroundColor: '#202124', // Dark color for button
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'flex-start', // Align items to start of button
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Space between icon and text
  },
  googleIcon: {
    color: '#F90101', // Official Google blue color
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
