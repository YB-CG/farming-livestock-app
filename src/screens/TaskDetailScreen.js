import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { updateTask, getTask } from '../services/api';
import Loader from '../components/Loader';


const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params; // Get taskId from route params
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await getTask(taskId);
        setTask(response.data);
      } catch (error) {
        console.error('Failed to fetch task', error);
        Alert.alert('Error', 'Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return <Loader />; // Show loader while fetching data
  }

  if (!task) {
    return <Text>Task not found</Text>; // Handle case where task is not found
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#FFA000';
      case 'Pending': return '#F44336';
      default: return '#757575';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return 'error-outline';
      case 'Medium': return 'warning';
      case 'Low': return 'info-outline';
      default: return 'help-outline';
    }
  };

  const handleMarkAsComplete = async () => {
    setLoading(true);
    try {
      await updateTask(task.id, { status: 'Completed' });
      Alert.alert('Success', 'Task marked as completed');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark task as complete');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateTask', { task })}>
            <Icon name="edit" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Icon name={getPriorityIcon(task.priority)} size={24} color={getStatusColor(task.status)} />
            <Text style={styles.title}>{task.title}</Text>
          </View>

          <View style={styles.infoContainer}>
            <InfoItem icon="event" label="Due Date" value={moment(task.due_date).format('MMMM D, YYYY')} />
            <InfoItem icon="flag" label="Priority" value={task.priority} />
            <InfoItem icon="hourglass-empty" label="Status" value={task.status} color={getStatusColor(task.status)} />
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleMarkAsComplete}>
          <Icon name="check-circle" size={24} color="#FFFFFF" />
          <Text style={styles.footerButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const InfoItem = ({ icon, label, value, color }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color="#2E7D32" />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TaskDetailScreen;