import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import { getCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/api';
import Loader from '../components/Loader';

const EventDetail = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await getCalendarEvent(eventId);
      setEvent(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setStartDate(new Date(response.data.start_time));
      setEndDate(new Date(response.data.end_time));
      setAllDay(response.data.all_day);
    } catch (error) {
      console.error('Failed to fetch event details', error);
      Alert.alert('Error', 'Failed to load event details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updatedEventData = {
        title,
        description,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        all_day: allDay,
      };
      await updateCalendarEvent(eventId, updatedEventData);
      setIsEditing(false);
      Alert.alert('Success', 'Health record updated successfully');
      await fetchEvent(); // Refresh the event data
    } catch (error) {
      console.error('Failed to update health record', error);
      Alert.alert('Error', 'Failed to update health record. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Health Record",
      "Are you sure you want to delete this health record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCalendarEvent(eventId);
      Alert.alert('Success', 'Health record deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete health record', error);
      Alert.alert('Error', 'Failed to delete health record. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!event) {
    return <View style={styles.container}><Text>No event data available</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Record</Text>
          {isEditing ? (
            <TouchableOpacity onPress={handleUpdate} disabled={isUpdating}>
              <Text style={styles.saveButton}>{isUpdating ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Icon name="edit" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            editable={isEditing}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            editable={isEditing}
          />
          
          <View style={styles.dateTimeRow}>
            <Text style={styles.label}>Start:</Text>
            <TouchableOpacity onPress={() => isEditing && setShowStartPicker(true)} style={styles.dateTimePicker}>
              <Text>{moment(startDate).format('MMM D, YYYY HH:mm')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateTimeRow}>
            <Text style={styles.label}>End:</Text>
            <TouchableOpacity onPress={() => isEditing && setShowEndPicker(true)} style={styles.dateTimePicker}>
              <Text>{moment(endDate).format('MMM D, YYYY HH:mm')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>All Day:</Text>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              disabled={!isEditing}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={allDay ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              disabled={isDeleting}
            >
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : 'Delete Health Record'}
              </Text>
            </TouchableOpacity>
          )}
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
      {(isUpdating || isDeleting) && <Loader />}
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
  deleteButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetail;