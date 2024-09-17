import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FlashMessage = ({ type, message }) => {
  const backgroundColor = type === 'error' ? '#FF5722' : '#4CAF50';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  message: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default FlashMessage;