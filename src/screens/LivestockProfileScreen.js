import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLivestock } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import { Card, CardHeader, CardContent } from '../components/ui/card';

const LivestockProfileScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [livestock, setLivestock] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLivestock();
  }, []);

  const fetchLivestock = async () => {
    setIsLoading(true);
    try {
      const response = await getLivestock(id);
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetails = () => (
    <Card>
      <CardHeader>Basic Information</CardHeader>
      <CardContent>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{livestock.animal_type}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tag:</Text>
          <Text style={styles.infoValue}>{livestock.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Breed:</Text>
          <Text style={styles.infoValue}>{livestock.breed}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>{new Date(livestock.date_of_birth).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{livestock.gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Weight:</Text>
          <Text style={styles.infoValue}>{livestock.current_weight} kg</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{livestock.current_age} months</Text>
        </View>
      </CardContent>
    </Card>
  );

  const renderHealth = () => (
    <Card>
      <CardHeader>Health Information</CardHeader>
      <CardContent>
        <View style={styles.healthStatus}>
          <Text style={styles.healthStatusText}>{livestock.status}</Text>
        </View>
        {/* <Text style={styles.sectionTitle}>Vaccination History</Text> */}
        {livestock.vaccinations && livestock.vaccinations.map((vaccination, index) => (
          <View key={index} style={styles.vaccinationItem}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.vaccinationText}>{vaccination.name} - {new Date(vaccination.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </CardContent>
    </Card>
  );

  const renderProduction = () => (
    <Card>
      <CardHeader>Production Information</CardHeader>
      <CardContent>
        <Text style={styles.sectionTitle}>Weight History</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={300}
          height={220}
          yAxisLabel="kg"
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!livestock) return null;

  if (!livestock) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: livestock.photo || 'https://via.placeholder.com/300' }} style={styles.heroImage} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateLivestock', { id })} style={styles.headerButton}>
            <Icon name="edit" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.title}>{livestock.name}</Text>
          <Text style={styles.subtitle}>{livestock.animal_type} - {livestock.breed}</Text>
        </View>

        <View style={styles.tabs}>
          {['Details', 'Health', 'Production'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'Details' && renderDetails()}
          {activeTab === 'Health' && renderHealth()}
          {activeTab === 'Production' && renderProduction()}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddLivestock', { livestockId: id })}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  profileInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  healthStatus: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  healthStatusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  vaccinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vaccinationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 28,
    elevation: 8,
  },
});

export default LivestockProfileScreen;