import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import { getCalendarEvents } from '../services/api'; // Assume this function exists to fetch calendar events

const RecordHealthScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getCalendarEvents();
      setEvents(response.data);
      updateMarkedDates(response.data);
    } catch (error) {
      console.error('Failed to fetch calendar events', error);
    }
  };

  const updateMarkedDates = (events) => {
    const marked = {};
    events.forEach(event => {
      const date = moment(event.start_time).format('YYYY-MM-DD');
      marked[date] = { marked: true, dotColor: '#4CAF50' };
    });
    setMarkedDates(marked);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const filteredEvents = events.filter(event => 
    moment(event.start_time).format('YYYY-MM-DD') === selectedDate
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.eventTime}>
        <Icon name="access-time" size={16} color="#757575" />
        <Text style={styles.eventTimeText}>
          {moment(item.start_time).format('HH:mm')} - {moment(item.end_time).format('HH:mm')}
        </Text>
      </View>
      <Text style={styles.eventTitle}>{item.title}</Text>
      {item.description && <Text style={styles.eventDescription}>{item.description}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Records</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHealthRecord')}
        >
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { 
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: '#4CAF50',
          }
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#4CAF50',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4CAF50',
          selectedDotColor: '#ffffff',
          arrowColor: '#4CAF50',
          monthTextColor: '#4CAF50',
          indicatorColor: '#4CAF50',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />

      <View style={styles.eventList}>
        <Text style={styles.dateHeader}>{moment(selectedDate).format('MMMM D, YYYY')}</Text>
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noEventsText}>No health records for this day</Text>
        )}
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
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  eventList: {
    flex: 1,
    padding: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventTimeText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecordHealthScreen;