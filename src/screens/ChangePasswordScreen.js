import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      await api.post('/auth/password/change/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      Alert.alert('Success', 'Password changed successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to change password', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <PasswordInput
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <PasswordInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <PasswordInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
          <Text style={styles.changeButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const PasswordInput = ({ placeholder, value, onChangeText }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Icon name="lock" size={24} color="#2E7D32" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
      />
      <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
        <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={24} color="#757575" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2E7D32',
            },
            form: {
                padding: 20,
                },
                inputContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    marginBottom: 20,
                    },
                    inputIcon: {
                        marginRight: 10,
                        },
                        input: {
                            flex: 1,
                            fontSize: 16,
                            color: '#333',
                            },
                            changeButton: {
                                backgroundColor: '#2E7D32',
                                padding: 15,
                                borderRadius: 8,
                                alignItems: 'center',
                                },
                                changeButtonText: {
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    },
                                    });

 export default ChangePasswordScreen;
