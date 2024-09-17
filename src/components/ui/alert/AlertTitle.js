import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AlertTitle = ({ children, style }) => (
  <Text style={[styles.alertTitle, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#842029',
    marginBottom: 8,
  },
});

export default AlertTitle;
