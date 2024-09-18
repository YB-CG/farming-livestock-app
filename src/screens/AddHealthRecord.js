import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Loader from '../components/Loader';
import { createCalendarEvent } from '../services/api';

const AddHealthRecord = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Error', 'Please enter a title for the health record.');
        return;
      }

      setIsLoading(true);
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        all_day: allDay,
      };
      
      const response = await createCalendarEvent(eventData);
      
      if (response.status === 201) {
        Alert.alert('Success', 'Health record added successfully');
        navigation.goBack();
      } else {
        throw new Error('Failed to add health record');
      }
    } catch (error) {
      console.error('Failed to add health record', error);
      Alert.alert('Error', 'Failed to add health record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Health Record</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          
          <View style={styles.dateTimeRow}>
            <Text style={styles.label}>Start:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateTimePicker}>
              <Text>{moment(startDate).format('MMM D, YYYY HH:mm')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateTimeRow}>
            <Text style={styles.label}>End:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateTimePicker}>
              <Text>{moment(endDate).format('MMM D, YYYY HH:mm')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>All Day:</Text>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={allDay ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onStartChange}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onEndChange}
          />
        )}
      </ScrollView>
      {isLoading && <Loader />}
    </SafeAreaView>
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
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    width: 60,
  },
  dateTimePicker: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default AddHealthRecord;