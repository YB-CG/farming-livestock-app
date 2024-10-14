import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Loader from '../components/Loader';
import { getTasks, getCalendarEvents } from '../services/api';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Use useRef for better performance

  useEffect(() => {
    fetchNotifications();
  }, [filter]); // Ensures refetching when the filter changes

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const [tasksResponse, eventsResponse] = await Promise.all([
        getTasks(),
        getCalendarEvents(),
      ]);

      const tasks = tasksResponse?.data?.results || [];
      const events = eventsResponse?.data?.results || [];

      const filteredTasks = tasks.filter(task =>
        moment(task.due_date).isSameOrBefore(moment(), 'day')
      );

      const filteredEvents = events.filter(event =>
        moment(event.start_time).isSameOrBefore(moment(), 'day')
      );

      const combinedNotifications = [
        ...filteredTasks.map(task => ({ ...task, type: 'task' })),
        ...filteredEvents.map(event => ({ ...event, type: 'health' })),
      ].sort((a, b) =>
        moment(b.due_date || b.start_time).diff(moment(a.due_date || a.start_time))
      );

      setNotifications(combinedNotifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch notifications. Please try again.');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#4CAF50';
      case 'In Progress':
        return '#FFA000';
      case 'Pending':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleNotificationPress = (notification) => {
    if (notification.type === 'task') {
      navigation.navigate('TaskDetail', { taskId: notification.id });
    } else if (notification.type === 'health') {
      navigation.navigate('EventDetail', { eventId: notification.id }); // Pass eventId correctly
    } else {
      console.error('Unknown notification type:', notification.type);
    }
  };
  
  const renderNotificationItem = ({ item }) => {
    const isTask = item.type === 'task';
    const date = isTask ? item.due_date : item.start_time;
    const title = item.title;
    const description = item.description;
  
    return (
      <Animated.View style={[styles.notificationItem, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => handleNotificationPress(item)}>
          <View style={styles.notificationHeader}>
            <View
              style={[
                styles.typeIndicator,
                { backgroundColor: isTask ? '#FFA000' : '#4CAF50' },
              ]}
            />
            <Icon
              name={isTask ? 'assignment' : 'event'}
              size={24}
              color={isTask ? '#FFA000' : '#4CAF50'}
            />
            <Text style={styles.notificationTitle}>{title}</Text>
          </View>
          <Text style={styles.notificationDescription}>{description}</Text>
          <View style={styles.notificationFooter}>
            <View style={styles.dateContainer}>
              <Icon name="access-time" size={16} color="#757575" />
              <Text style={styles.notificationDate}>
                {moment(date).format('MMM D, YYYY HH:mm')}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Icon
                name={isTask ? 'flag' : 'favorite'}
                size={16}
                color={isTask ? getStatusColor(item.status) : '#4CAF50'}
              />
              <Text
                style={[
                  styles.notificationStatus,
                  { color: isTask ? getStatusColor(item.status) : '#4CAF50' },
                ]}
              >
                {isTask ? item.status : 'Health Record'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'tasks', 'health'].map((filterType) => (
        <TouchableOpacity
          key={filterType}
          style={[styles.filterButton, filter === filterType && styles.activeFilter]}
          onPress={() => setFilter(filterType)}
        >
          <Text
            style={[styles.filterText, filter === filterType && styles.activeFilterText]}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true;
  
    // Map 'tasks' filter to 'task' type
    const filterType = filter === 'tasks' ? 'task' : 'health';
    return item.type === filterType;
  });
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {renderFilterButtons()}

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.notificationList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off" size={48} color="#BDBDBD" />
              <Text style={styles.emptyListText}>No notifications found</Text>
            </View>
          }
          initialNumToRender={10} // Optimize FlatList rendering
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#E8F5E9',
  },
  filterText: {
    fontSize: 14,
    color: '#757575',
  },
  activeFilterText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  notificationList: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 15,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginLeft: 34,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 34,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
});

export default NotificationsScreen;