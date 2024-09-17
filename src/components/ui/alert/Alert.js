import React from 'react';
import { View, StyleSheet } from 'react-native';

const Alert = ({ children, style }) => (
  <View style={[styles.alert, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C2C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
});

export default Alert;
