import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, Button } from '../components/ui/form';

const animalTypes = ['Cow', 'Cattle', 'Sheep', 'Goat', 'Chicken'];
const breedsByType = {
  Cow: ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental'],
  Cattle: ['Brahman', 'Charolais', 'Limousin', 'Gelbvieh', 'Shorthorn'],
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
    gender: '',
    acquisition_date: new Date(),
    acquisition_method: '',
    status: 'Active',
    current_weight: '',
    current_age: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);

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
        <Picker.Item label="Select Gender" value="" />
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
        <Picker.Item label="Select Acquisition Method" value="" />
        <Picker.Item label="Purchase" value="Purchase" />
        <Picker.Item label="Born on Farm" value="Born on Farm" />
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    // For now, we'll just log it and navigate back
    navigation.goBack();
  };

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
          value={formData[activeDateField] || new Date()}  // Ensure a valid Date object is passed
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
});

export default AddLivestockScreen;