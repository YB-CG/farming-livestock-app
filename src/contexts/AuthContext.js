import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const authReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        refreshToken: action.refreshToken,
        isLoading: false,
        isNewUser: action.isNewUser,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        refreshToken: action.refreshToken,
        isNewUser: false,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        refreshToken: null,
        isNewUser: false,
      };
    case 'SIGN_UP':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        refreshToken: action.refreshToken,
        isNewUser: true,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...prevState,
        isNewUser: false,
      };
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignout: false,
    userToken: null,
    refreshToken: null,
    isNewUser: false,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let refreshToken;
      let isNewUser;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        refreshToken = await AsyncStorage.getItem('refreshToken');
        isNewUser = await AsyncStorage.getItem('isNewUser') === 'true';
      } catch (e) {
        console.error('Error restoring token:', e);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, refreshToken, isNewUser });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (token, refreshToken) => {
        if (!token || !refreshToken) {
          console.error('Invalid tokens provided for sign in');
          return;
        }
        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          await AsyncStorage.setItem('isNewUser', 'false');
          dispatch({ type: 'SIGN_IN', token, refreshToken });
        } catch (e) {
          console.error('Error saving tokens:', e);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'isNewUser']);
          dispatch({ type: 'SIGN_OUT' });
        } catch (e) {
          console.error('Error removing tokens:', e);
        }
      },
      signUp: async (token, refreshToken) => {
        if (!token || !refreshToken) {
          console.error('Invalid tokens provided for sign up');
          return;
        }
        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          await AsyncStorage.setItem('isNewUser', 'true');
          dispatch({ type: 'SIGN_UP', token, refreshToken });
        } catch (e) {
          console.error('Error saving tokens:', e);
        }
      },
      completeOnboarding: async () => {
        try {
          await AsyncStorage.setItem('isNewUser', 'false');
          dispatch({ type: 'COMPLETE_ONBOARDING' });
        } catch (e) {
          console.error('Error saving onboarding state:', e);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...authContext, state }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };