import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NavItem = ({ icon, isSelected, onPress }) => {
  const animatedValue = new Animated.Value(isSelected ? 1 : 0);

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isSelected ? 1 : 0,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const animatedScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.navItem, { transform: [{ scale: animatedScale }] }]}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={isSelected ? '#4A90E2' : '#888'} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const BottomNavBar = () => {
  const [selectedTab, setSelectedTab] = useState('home');

  const navItems = [
    { icon: 'home', key: 'home' },
    { icon: 'cow', key: 'livestock' },
    { icon: 'calendar-check', key: 'tasks' },
    { icon: 'chart-bar', key: 'stats' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <NavItem
          key={item.key}
          icon={item.icon}
          isSelected={selectedTab === item.key}
          onPress={() => setSelectedTab(item.key)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
});

export default BottomNavBar;