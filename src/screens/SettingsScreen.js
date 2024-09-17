import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../contexts/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLocationEnabled, setLocationEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const { signOut } = useContext(AuthContext);

  const toggleNotifications = () => setNotificationsEnabled(prevState => !prevState);
  const toggleLocation = () => setLocationEnabled(prevState => !prevState);
  const toggleDarkMode = () => setDarkModeEnabled(prevState => !prevState);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => signOut() }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Delete account") }
      ]
    );
  };

  const renderSettingItem = (icon, title, onPress, rightComponent) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <Icon name={icon} size={24} color="#2E7D32" />
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#757575" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem("person", "Edit Profile", () => navigation.navigate('EditProfile'))}
          {renderSettingItem("lock", "Change Password", () => navigation.navigate('ChangePassword'))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem("location-on", "Location Services", toggleLocation, 
            <Switch
              value={isLocationEnabled}
              onValueChange={toggleLocation}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isLocationEnabled ? '#2E7D32' : '#f4f3f4'}
            />
          )}
          {renderSettingItem("brightness-2", "Dark Mode", toggleDarkMode, 
            <Switch
              value={isDarkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkModeEnabled ? '#2E7D32' : '#f4f3f4'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          {renderSettingItem("help", "FAQ", () => navigation.navigate('FAQ'))}
          {renderSettingItem("contact-support", "Contact Support", () => navigation.navigate('ContactSupport'))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          {renderSettingItem("privacy-tip", "Privacy Policy", () => navigation.navigate('PrivacyPolicy'))}
          {renderSettingItem("gavel", "Terms and Conditions", () => navigation.navigate('TermsConditions'))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Icon name="delete-forever" size={24} color="#FFFFFF" />
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingsScreen;