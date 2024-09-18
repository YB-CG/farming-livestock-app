import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserProfile } from '../services/api';
import Loader from '../components/Loader';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="edit" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userProfile.profile_picture || 'https://via.placeholder.com/150' }}
            style={styles.profilePicture}
          />
          <Text style={styles.name}>{`${userProfile.first_name} ${userProfile.last_name}`}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoItem icon="business" label="Farm Name" value={userProfile.country || 'Not provided'} />
          <InfoItem icon="phone" label="Phone" value={userProfile.phone_number || 'Not provided'} />
          {/* <InfoItem icon="cake" label="Date of Birth" value={userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toDateString() : 'Not provided'} /> */}
          <InfoItem icon="home" label="Address" value={userProfile.address || 'Not provided'} />
          <InfoItem icon="location-city" label="City" value={userProfile.city || 'Not provided'} />
          <InfoItem icon="map" label="State/Province" value={userProfile.state_province || 'Not provided'} />
          <InfoItem icon="markunread-mailbox" label="Postal Code" value={userProfile.postal_code || 'Not provided'} />

        </View>

        <TouchableOpacity 
          style={styles.changePasswordButton} 
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Icon name="lock" size={24} color="#FFFFFF" />
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color="#2E7D32" />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#757575',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  changePasswordButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  changePasswordText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;