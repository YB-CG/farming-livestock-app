import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [animatedStrength] = useState(new Animated.Value(0));

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      if (password.length > 6) score++;
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
      if (password.match(/\d/)) score++;
      if (password.match(/[^a-zA-Z\d]/)) score++;
      return score;
    };

    const newStrength = calculateStrength();
    setStrength(newStrength);

    Animated.timing(animatedStrength, {
      toValue: newStrength,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [password]);

  const width = animatedStrength.interpolate({
    inputRange: [0, 4],
    outputRange: ['0%', '100%'],
  });

  const backgroundColor = animatedStrength.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: ['#FF5722', '#FFC107', '#FFC107', '#8BC34A', '#4CAF50'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.strengthBar, { width, backgroundColor }]} />
      <Text style={styles.strengthText}>
        {strength === 0 ? 'Weak' : strength === 1 ? 'Fair' : strength === 2 ? 'Good' : strength === 3 ? 'Strong' : 'Very Strong'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  strengthBar: {
    height: 5,
    borderRadius: 2.5,
    marginBottom: 5,
  },
  strengthText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default PasswordStrengthIndicator;