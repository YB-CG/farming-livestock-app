import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Loader from '../components/Loader';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GreenFarm</Text>
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7CB342',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
});

export default SplashScreen;