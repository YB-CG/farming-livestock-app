import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';

const { width, height } = Dimensions.get('window');

const PersonalInfoScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(AuthContext);

  // State for DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prevState => ({
        ...prevState,
        date_of_birth: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await updateUserProfile(formData);
      navigation.navigate('FarmInfo');
    } catch (error) {
      setError(error.message || 'Failed to update personal information');
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
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.card}>
                <Text style={styles.title}>Personal Information</Text>
                <View style={styles.progressIndicator}>
                  <Text style={styles.activeStep}>PERSONAL INFO</Text>
                  <Text style={styles.inactiveStep}>FARM DETAIL</Text>
                </View>
                <Input
                  label="First Name"
                  value={formData.first_name}
                  onChangeText={(value) => handleInputChange('first_name', value)}
                  placeholder="Enter your first name"
                />
                <Input
                  label="Last Name"
                  value={formData.last_name}
                  onChangeText={(value) => handleInputChange('last_name', value)}
                  placeholder="Enter your last name"
                />
                <Input
                  label="Phone Number"
                  value={formData.phone_number}
                  onChangeText={(value) => handleInputChange('phone_number', value)}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
                
                {/* Date of Birth Picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.datePickerText}>
                      {formData.date_of_birth
                        ? new Date(formData.date_of_birth).toLocaleDateString()
                        : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                {/* Gender Picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                      style={styles.picker}
                      mode="dropdown"
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                      <Picker.Item label="Other" value="other" />
                      <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
                    </Picker>
                  </View>
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
            </ScrollView>
            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button title="Next" onPress={handleSubmit} style={styles.nextButton} />
            </View>
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
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: -50,
  },
  picker: {
    width: '100%',
  },
  error: {
    color: '#FF5722',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  nextButton: {
    backgroundColor: '#7CB342',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PersonalInfoScreen;
