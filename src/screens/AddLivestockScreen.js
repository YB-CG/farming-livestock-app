import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button } from '../components/ui/form';
import { createLivestock } from '../services/api';
import Loader from '../components/Loader';

const animalTypes = ['Cow', 'Sheep', 'Goat', 'Chicken'];
const breedsByType = {
  Cow: ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental'],
  Sheep: ['Merino', 'Suffolk', 'Dorper', 'Romney', 'Texel'],
  Goat: ['Boer', 'Nubian', 'Alpine', 'Saanen', 'Angora'],
  Chicken: ['Leghorn', 'Rhode Island Red', 'Plymouth Rock', 'Orpington', 'Australorp'],
};

const AddLivestockScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    animal_type: '',
    breed: '',
    name: '',
    date_of_birth: new Date(),
    gender: 'Male',
    acquisition_date: new Date(),
    acquisition_method: 'Breeding',
    status: 'Active',
    current_weight: '',
    current_age: '',
    photo: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    if (value !== undefined) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, [activeDateField]: selectedDate });
    }
  };

  const showDatepicker = (field) => {
    setShowDatePicker(true);
    setActiveDateField(field);
  };

  const pickImage = async (useCamera = false) => {
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0] });
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.label}>Animal Type</Text>
      <Picker
        selectedValue={formData.animal_type}
        onValueChange={(value) => handleInputChange('animal_type', value)}
      >
        <Picker.Item label="Select Animal Type" value="" />
        {animalTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>
  
      <Text style={styles.label}>Breed</Text>
      <Picker
        selectedValue={formData.breed}
        onValueChange={(value) => handleInputChange('breed', value)}
        enabled={!!formData.animal_type}
      >
        <Picker.Item label="Select Breed" value="" />
        {(breedsByType[formData.animal_type] || []).map((breed) => (
          <Picker.Item key={breed} label={breed} value={breed} />
        ))}
      </Picker>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity onPress={() => showDatepicker('date_of_birth')}>
        <Text>{formData.date_of_birth.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={formData.gender}
        onValueChange={(value) => handleInputChange('gender', value)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text style={styles.label}>Current Weight (kg)</Text>
      <TextInput
        value={formData.current_weight}
        onChangeText={(value) => handleInputChange('current_weight', value)}
        keyboardType="numeric"
        placeholder="Enter current weight"
      />

      <Text style={styles.label}>Current Age (months)</Text>
      <TextInput
        value={formData.current_age}
        onChangeText={(value) => handleInputChange('current_age', value)}
        keyboardType="numeric"
        placeholder="Enter current age"
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.label}>Acquisition Date</Text>
      <TouchableOpacity onPress={() => showDatepicker('acquisition_date')}>
        <Text>{formData.acquisition_date.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Acquisition Method</Text>
      <Picker
        selectedValue={formData.acquisition_method}
        onValueChange={(value) => handleInputChange('acquisition_method', value)}
      >
        <Picker.Item label="Breeding" value="Breeding" />
        <Picker.Item label="Purchase" value="Purchase" />
        <Picker.Item label="Trade" value="Trade" />
        <Picker.Item label="Gift" value="Gift" />
      </Picker>

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={formData.status}
        onValueChange={(value) => handleInputChange('status', value)}
      >
        <Picker.Item label="Active" value="Active" />
        <Picker.Item label="Sold" value="Sold" />
        <Picker.Item label="Deceased" value="Deceased" />
      </Picker>

      <Text style={styles.label}>photo (Optional)</Text>
      <View style={styles.imageContainer}>
        {formData.photo && (
          <Image source={{ uri: formData.photo.uri }} style={styles.image} />
        )}
        <View style={styles.imageButtonContainer}>
          <Button onPress={() => pickImage(false)}>Choose from Gallery</Button>
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const livestockData = new FormData();
  
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          // Append image file correctly if a photo exists
          livestockData.append('photo', {
            uri: formData[key].uri,
            type: 'image/jpeg', // Ensure the correct mime type
            name: 'livestock_photo.jpg',
          });
        } else if (formData[key] instanceof Date) {
          // Convert dates to ISO string (or the format expected by the server)
          livestockData.append(key, formData[key].toISOString().split('T')[0]);
        } else if (formData[key]) {
          // Append other form fields, converting them to string if necessary
          livestockData.append(key, String(formData[key]));
        }
      });
  
      // API call
      await createLivestock(livestockData);
      console.log('Livestock created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create livestock:', error.response?.data || error.message);
      // Handle error (e.g., show an alert)
    } finally {
      setLoading(false);
    }
  };
  
  
  

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Add New Livestock</Text>
        <Text style={styles.stepIndicator}>Step {step} of 3</Text>

        {renderStepContent()}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <Button onPress={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onPress={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onPress={handleSubmit}>
              Submit
            </Button>
          )}
        </View>
      </ScrollView>

      {showDatePicker && activeDateField && (
        <DateTimePicker
          value={formData[activeDateField] || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepIndicator: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default AddLivestockScreen;