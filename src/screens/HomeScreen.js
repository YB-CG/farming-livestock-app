import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserProfile, getWeather, getTasks, getAlerts } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().format('LT'));
  const { state } = useContext(AuthContext);

  useEffect(() => {
    if (state.isNewUser) {
      navigation.navigate('PersonalInfo');
    }
  }, [state.isNewUser, navigation]);

  useEffect(() => {
    fetchUserProfile();
    fetchWeather();
    fetchTasks();
    fetchAlerts();

    const interval = setInterval(() => {
      setCurrentTime(moment().format('LT'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  const fetchWeather = async () => {
    try {
      const weatherData = await getWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather data', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const alertsData = await getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to fetch alerts', error);
    }
  };

  const renderWeatherIcon = () => {
    if (!weather) return null;
    switch (weather.description.toLowerCase()) {
      case 'sunny':
        return <Icon name="wb-sunny" size={40} color="#FFA000" />;
      case 'cloudy':
        return <Icon name="cloud" size={40} color="#78909C" />;
      case 'rainy':
        return <Icon name="grain" size={40} color="#4FC3F7" />;
      default:
        return <Icon name="wb-sunny" size={40} color="#FFA000" />;
    }
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.farmName}>{userProfile?.first_name || 'Farm Name'} {userProfile?.last_name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: userProfile?.profile_picture || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.weatherCard}>
          {renderWeatherIcon()}
          <View>
            <Text style={styles.weatherTemp}>{weather?.temp}°C</Text>
            <Text style={styles.weatherDesc}>{weather?.description}</Text>
          </View>
          <Text style={styles.currentTime}>{currentTime}</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddLivestock')}>
            <Icon name="add-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Add Livestock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('RecordHealth')}>
            <Icon name="healing" size={24} color="#F44336" />
            <Text style={styles.actionText}>Record Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UpdateInventory')}>
            <Icon name="edit" size={24} color="#2196F3" />
            <Text style={styles.actionText}>Update Inventory</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks for Today</Text>
          {tasks.slice(0, 3).map((task, index) => (
            <View key={index} style={styles.taskItem}>
              <Icon name="check-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.taskText}>{task.title}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAllLink}>See all tasks</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Performance</Text>
          <LineChart
            data={chartData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#4CAF50" />
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
            <Icon name="settings" size={24} color="#757575"  />
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
  },
  greeting: {
    fontSize: 16,
    color: '#757575',
  },
  farmName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  weatherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDesc: {
    fontSize: 16,
    color: '#666',
  },
  currentTime: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  seeAllLink: {
    color: '#2196F3',
    fontSize: 14,
    marginTop: 10,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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

export default HomeScreen;