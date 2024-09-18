import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getLivestock, updateLivestock, deleteLivestock } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UpdateLivestockScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [livestock, setLivestock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchLivestock();
  }, []);

  const fetchLivestock = async () => {
    try {
      const response = await getLivestock(id);
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock details:', error);
      Alert.alert('Error', 'Failed to fetch livestock details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateLivestock(id, livestock);
      Alert.alert('Success', 'Livestock information updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating livestock:', error);
      Alert.alert('Error', 'Failed to update livestock information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this livestock?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLivestock(id);
              Alert.alert('Success', 'Livestock deleted successfully');
              navigation.navigate('LivestockList');
            } catch (error) {
              console.error('Error deleting livestock:', error);
              Alert.alert('Error', 'Failed to delete livestock');
            }
          }
        },
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setLivestock({ ...livestock, photo: result.uri });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Livestock</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="delete" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {livestock.photo ? (
            <Image source={{ uri: livestock.photo }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="add-a-photo" size={40} color="#757575" />
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={livestock.name}
            onChangeText={(text) => setLivestock({ ...livestock, name: text })}
            placeholder="Enter name"
          />

          <Text style={styles.label}>Type</Text>
          <Picker
            selectedValue={livestock.animal_type}
            onValueChange={(itemValue) => setLivestock({ ...livestock, animal_type: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Cow" value="Cow" />
            <Picker.Item label="Sheep" value="Sheep" />
            <Picker.Item label="Goat" value="Goat" />
            <Picker.Item label="Chicken" value="Chicken" />
          </Picker>

          <Text style={styles.label}>Breed</Text>
          <TextInput
            style={styles.input}
            value={livestock.breed}
            onChangeText={(text) => setLivestock({ ...livestock, breed: text })}
            placeholder="Enter breed"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text>{new Date(livestock.date_of_birth).toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(livestock.date_of_birth)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setLivestock({ ...livestock, date_of_birth: selectedDate.toISOString() });
                }
              }}
            />
          )}

          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={livestock.gender}
            onValueChange={(itemValue) => setLivestock({ ...livestock, gender: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={livestock.current_weight.toString()}
            onChangeText={(text) => setLivestock({ ...livestock, current_weight: parseFloat(text) || 0 })}
            keyboardType="numeric"
            placeholder="Enter weight"
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update Livestock</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  deleteButton: {
    padding: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#757575',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateLivestockScreen;