import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CardHeader = ({ children, ...props }) => (
  <View style={styles.cardHeader} {...props}>
    <Text style={styles.cardHeaderText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default CardHeader;
