import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPassword } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import FlashMessage from '../components/FlashMessage';
import Loader from '../components/Loader';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    setFlashMessage(null);
    try {
      await forgotPassword(email);
      setFlashMessage({
        type: 'success',
        message: 'Password reset email sent. Please check your inbox.',
      });
      setIsResetSuccessful(true);
    } catch (error) {
      setFlashMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send reset email. Please try again.',
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
          <View style={styles.card}>
            <Text style={styles.title}>Reset Password</Text>
            {flashMessage && (
              <FlashMessage type={flashMessage.type} message={flashMessage.message} />
            )}
            {!isResetSuccessful && (
              <>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Button title="Send Reset Email" onPress={handleResetPassword} style={styles.resetButton} />
              </>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
          {isLoading && <Loader />}
        </SafeAreaView>
      </LinearGradient>
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
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#7CB342',
    height: 56,
    borderRadius: 28,
    marginTop: 20,
  },
  link: {
    color: '#0000FF',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;