import React, { useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import GoogleIcon from '../components/GoogleIcon';
import Loader from '../components/Loader';
import { googleSignIn } from '../services/api';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '33413352712-3n8gt88qhimrhjuja52pfq6lchmaer5r.apps.googleusercontent.com',
    // You might need to add your iOS clientId and AndroidClientId here as well
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    setIsLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseToken = await userCredential.user.getIdToken();
      
      // Send the Firebase token to your backend
      const backendResponse = await googleSignIn(firebaseToken);
      const { access_token, refresh_token } = backendResponse.data;
  
      if (access_token && refresh_token) {
        await signIn(access_token, refresh_token);
      } else {
        Alert.alert('Login Error', 'Missing tokens in the response');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      Alert.alert('Login Error', 'An error occurred during Google login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => promptAsync()}
        disabled={!request}
      >
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