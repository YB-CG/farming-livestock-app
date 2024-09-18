import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const UpdateTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(new Date(task.due_date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'In Progress', 'Completed'];

  const handleUpdate = () => {
    // Here you would typically call an API to update the task
    const updatedTask = {
      ...task,
      title,
      description,
      priority,
      status,
      due_date: moment(dueDate).format('YYYY-MM-DD'),
    };
    console.log('Updated task:', updatedTask);
    // After updating, navigate back to the task details
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
          // Here you would typically call an API to delete the task
          console.log('Deleting task:', task.id);
          navigation.navigate('Tasks'); // Navigate back to the task list
        }}
      ]
    );
  };

  const renderButtonGroup = (options, selectedOption, setOption) => (
    <View style={styles.buttonGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.button, selectedOption === option && styles.selectedButton]}
          onPress={() => setOption(option)}
        >
          <Text style={[styles.buttonText, selectedOption === option && styles.selectedButtonText]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Task</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Priority</Text>
          {renderButtonGroup(priorities, priority, setPriority)}

          <Text style={styles.label}>Status</Text>
          {renderButtonGroup(statuses, status, setStatus)}

          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{moment(dueDate).format('MMMM D, YYYY')}</Text>
            <Icon name="date-range" size={24} color="#4CAF50" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={24} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Delete Task</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  saveButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UpdateTaskScreen;