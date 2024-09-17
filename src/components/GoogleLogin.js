import React, { useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGoogleLoginUrl, exchangeGoogleCode } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import GoogleIcon from '../components/GoogleIcon';
import Loader from '../components/Loader';

const GoogleLogin = () => {
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await getGoogleLoginUrl();
      const result = await WebBrowser.openAuthSessionAsync(
        response.data.url,
        'https://farming-livestock-core.onrender.com/api/auth/google/callback/'
      );

      console.log('WebBrowser result:', result);

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        console.log('Extracted code:', code);

        if (code) {
          try {
            const tokenResponse = await exchangeGoogleCode(code);
            console.log('Token response:', tokenResponse.data);

            const { access, refresh } = tokenResponse.data;
            
            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);

            signIn(access);
          } catch (error) {
            console.error('Error exchanging code for tokens:', error.response ? error.response.data : error.message);
          }
        } else {
          console.error('No code found in the redirect URL');
        }
      } else if (result.type === 'cancel') {
        console.log('User cancelled the login flow');
      } else {
        console.error('Authentication failed:', result);
      }
    } catch (error) {
      console.error('Error in Google login process:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <View style={styles.googleIconContainer}>
          <GoogleIcon />
        </View>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#202124',
    height: 56,
    borderRadius: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleLogin;