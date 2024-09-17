import React from 'react';
import { View, StyleSheet } from 'react-native';

export const CardContent = ({ children, ...props }) => (
  <View style={styles.cardContent} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  cardContent: {
    padding: 16,
  },
});

export default CardContent;
