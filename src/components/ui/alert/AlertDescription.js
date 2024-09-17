import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AlertDescription = ({ children, style }) => (
  <Text style={[styles.alertDescription, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  alertDescription: {
    fontSize: 14,
    color: '#842029',
  },
});

export default AlertDescription;
