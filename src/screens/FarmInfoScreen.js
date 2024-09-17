import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { updateFarmInfo } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { LinearGradient } from 'expo-linear-gradient';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';

const FarmInfoScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    farm_name: '',
    farm_email: '',
    farm_website: '',
    farm_phone_number: '',
    farm_address: '',
    farm_city: '',
    farm_state_province: '',
    farm_country: '',
    farm_postal_code: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(AuthContext); // Get the auth state which includes user info
  const farmId = state?.user?.farmId; // Assuming farmId is available in the user object

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!farmId) {
      setError('Farm ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await updateFarmInfo(farmId, formData); // Pass farmId and formData to the update function
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message || 'Failed to update farm information');
    }
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/grass-background.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
          >
            <ScrollView>
              <View style={styles.card}>
                <Text style={styles.title}>Farm Information</Text>
                <View style={styles.progressIndicator}>
                  <Text style={styles.inactiveStep}>PERSONAL INFO</Text>
                  <Text style={styles.activeStep}>FARM DETAIL</Text>
                </View>
                <Input
                  label="Farm Name"
                  value={formData.farm_name}
                  onChangeText={(value) => handleInputChange('farm_name', value)}
                  placeholder="Enter your farm name"
                />
                <Input
                  label="Farm Email"
                  value={formData.farm_email}
                  onChangeText={(value) => handleInputChange('farm_email', value)}
                  placeholder="Enter farm email"
                  keyboardType="email-address"
                />
                <Input
                  label="Farm Website"
                  value={formData.farm_website}
                  onChangeText={(value) => handleInputChange('farm_website', value)}
                  placeholder="Enter farm website"
                  keyboardType="url"
                />
                <Input
                  label="Farm Phone Number"
                  value={formData.farm_phone_number}
                  onChangeText={(value) => handleInputChange('farm_phone_number', value)}
                  placeholder="Enter farm phone number"
                  keyboardType="phone-pad"
                />
                <Input
                  label="Farm Address"
                  value={formData.farm_address}
                  onChangeText={(value) => handleInputChange('farm_address', value)}
                  placeholder="Enter farm address"
                />
                <Input
                  label="Farm City"
                  value={formData.farm_city}
                  onChangeText={(value) => handleInputChange('farm_city', value)}
                  placeholder="Enter farm city"
                />
                <Input
                  label="Farm State/Province"
                  value={formData.farm_state_province}
                  onChangeText={(value) => handleInputChange('farm_state_province', value)}
                  placeholder="Enter farm state or province"
                />
                <Input
                  label="Farm Country"
                  value={formData.farm_country}
                  onChangeText={(value) => handleInputChange('farm_country', value)}
                  placeholder="Enter farm country"
                />
                <Input
                  label="Farm Postal Code"
                  value={formData.farm_postal_code}
                  onChangeText={(value) => handleInputChange('farm_postal_code', value)}
                  placeholder="Enter farm postal code"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Button title="Complete Registration" onPress={handleSubmit} style={styles.completeButton} />
              </View>
            </ScrollView>
            {isLoading && <Loader />}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activeStep: {
    fontWeight: 'bold',
    color: '#7CB342',
  },
  inactiveStep: {
    color: '#999',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  error: {
    color: '#FF5722',
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: '#7CB342',
    height: 56,
    borderRadius: 28,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
});

export default FarmInfoScreen;
