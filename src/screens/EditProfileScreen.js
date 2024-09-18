import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { getUserProfile, updateUserProfile } from '../services/api';
import Loader from '../components/Loader';

const EditProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    profile_picture: null,
    phone_number: '',
    address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(userProfile);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setUserProfile(prevState => ({ ...prevState, [key]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange('profile_picture', result.assets[0]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleUpdateProfile}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loader />
        ) : (
          <View style={styles.form}>
            <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
              {userProfile.profile_picture ? (
                <Image 
                  source={{ uri: userProfile.profile_picture.uri || userProfile.profile_picture }} 
                  style={styles.profilePicture} 
                />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <Icon name="person" size={50} color="#CCCCCC" />
                </View>
              )}
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            <InputField
              icon="person"
              placeholder="First Name"
              value={userProfile.first_name}
              onChangeText={(text) => handleChange('first_name', text)}
            />
            <InputField
              icon="person"
              placeholder="Last Name"
              value={userProfile.last_name}
              onChangeText={(text) => handleChange('last_name', text)}
            />
            <InputField
              icon="email"
              placeholder="Email"
              value={userProfile.email}
              editable={false}
            />
            <InputField
              icon="business"
              placeholder="Farm Name"
              value={userProfile.country}
              onChangeText={(text) => handleChange('country', text)}
            />
            <InputField
              icon="phone"
              placeholder="Phone Number"
              value={userProfile.phone_number}
              onChangeText={(text) => handleChange('phone_number', text)}
              keyboardType="phone-pad"
            />
            <InputField
              icon="home"
              placeholder="Address"
              value={userProfile.address}
              onChangeText={(text) => handleChange('address', text)}
            />
            <InputField
              icon="location-city"
              placeholder="City"
              value={userProfile.city}
              onChangeText={(text) => handleChange('city', text)}
            />
            <InputField
              icon="map"
              placeholder="State/Province"
              value={userProfile.state_province}
              onChangeText={(text) => handleChange('state_province', text)}
            />
            <InputField
              icon="markunread-mailbox"
              placeholder="Postal Code"
              value={userProfile.postal_code}
              onChangeText={(text) => handleChange('postal_code', text)}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InputField = ({ icon, placeholder, value, onChangeText, keyboardType = 'default', editable = true }) => (
  <View style={styles.inputContainer}>
    <Icon name={icon} size={24} color="#2E7D32" style={styles.inputIcon} />
    <TextInput
      style={[styles.input, !editable && styles.disabledInput]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
    />
  </View>
);

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
  saveButton: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333333',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#888888',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 10,
    color: '#2E7D32',
    fontSize: 16,
  },
});

export default EditProfileScreen;