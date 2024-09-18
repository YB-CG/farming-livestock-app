import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const TasksScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(moment());

  // Dummy data for tasks
  const dummyTasks = [
    { id: '1', title: 'Feed livestock', description: 'Distribute feed to all animals', priority: 'High', status: 'Pending', due_date: moment().format('YYYY-MM-DD') },
    { id: '2', title: 'Check water supply', description: 'Ensure all water troughs are filled', priority: 'Medium', status: 'In Progress', due_date: moment().format('YYYY-MM-DD') },
    { id: '3', title: 'Repair fencing', description: 'Fix damaged fencing in the north field', priority: 'Low', status: 'Pending', due_date: moment().add(1, 'days').format('YYYY-MM-DD') },
    { id: '4', title: 'Order new seeds', description: 'Place order for next season\'s crops', priority: 'Medium', status: 'Completed', due_date: moment().subtract(1, 'days').format('YYYY-MM-DD') },
    { id: '5', title: 'Maintenance on tractor', description: 'Perform routine maintenance on the main tractor', priority: 'High', status: 'Pending', due_date: moment().format('YYYY-MM-DD') },
  ];

  const filterTasksByDate = (date) => {
    return dummyTasks.filter(task => moment(task.due_date).isSame(date, 'day'));
  };

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

  const renderTask = ({ item }) => {
    const isOverdue = moment(item.due_date).isBefore(moment(), 'day');
    return (
      <TouchableOpacity
        style={[styles.taskItem, isOverdue && styles.overdueTask]}
        onPress={() => { navigation.navigate('TaskDetail', { task: item }) }}
      >
        <View style={styles.taskHeader}>
          <Icon name={getPriorityIcon(item.priority)} size={24} color={getStatusColor(item.status)} />
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskStatus}>{item.status}</Text>
          <Text style={styles.taskDueDate}>{moment(item.due_date).format('MMM D, YYYY')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateNavigation = () => (
    <View style={styles.dateNavigation}>
      <TouchableOpacity onPress={() => setSelectedDate(moment(selectedDate).subtract(1, 'days'))}>
        <Icon name="chevron-left" size={30} color="#4CAF50" />
      </TouchableOpacity>
      <Text style={styles.dateText}>{selectedDate.format('MMMM D, YYYY')}</Text>
      <TouchableOpacity onPress={() => setSelectedDate(moment(selectedDate).add(1, 'days'))}>
        <Icon name="chevron-right" size={30} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddTask')}>
            <Icon name="add-circle-outline" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {renderDateNavigation()}

      <FlatList
        data={filterTasksByDate(selectedDate)}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.taskList}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No tasks for this day</Text>
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#757575" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Livestock')}>
          <Icon name="pets" size={24} color="#757575" />
          <Text style={styles.navText}>Livestock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inventory')}>
          <Icon name="inventory" size={24} color="#757575" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#757575" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskList: {
    padding: 20,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#757575',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    color: '#757575',
  },
});

export default TasksScreen;