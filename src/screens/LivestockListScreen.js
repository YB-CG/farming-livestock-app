import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLivestockList, deleteLivestock } from '../services/api';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

const LivestockListScreen = ({ navigation }) => {
  const [livestock, setLivestock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const fetchLivestock = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await getLivestockList();
      setLivestock(response.data.results);
    } catch (error) {
      console.error('Error fetching livestock:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLivestock();
    }, [])
  );

  const handleDelete = async (id) => {
    try {
      await deleteLivestock(id);
      fetchLivestock();
    } catch (error) {
      console.error('Error deleting livestock:', error);
    }
  };

  const renderLivestockItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('UpdateLivestock', { id: item.id })}
          >
            <Icon name="edit" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Icon name="delete" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('LivestockProfile', { id: item.id })}
      >
        <Image source={{ uri: item.photo }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.animal_type}</Text>
          <Text style={styles.subtitle}>{item.breed}</Text>
          <View style={[styles.healthIndicator, { backgroundColor: item.health_status === 'Healthy' ? '#4CAF50' : '#F44336' }]} />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const filteredLivestock = livestock.filter(item => 
    item.animal_type.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterType === 'All' || item.animal_type === filterType)
  );

  const renderFilterButton = (type) => (
    <TouchableOpacity
      style={[styles.filterButton, filterType === type && styles.activeFilterButton]}
      onPress={() => setFilterType(type)}
    >
      <Text style={[styles.filterButtonText, filterType === type && styles.activeFilterButtonText]}>{type}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Livestock</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddLivestock')}>
          <Icon name="add" size={30} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search livestock..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('All')}
        {renderFilterButton('Cow')}
        {renderFilterButton('Sheep')}
        {renderFilterButton('Goat')}
        {renderFilterButton('Chicken')}
        
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2E7D32" />
      ) : (
        <FlatList
          data={filteredLivestock}
          renderItem={renderLivestockItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isRefreshing}
          onRefresh={() => fetchLivestock(true)}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No livestock found</Text>
          }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  healthIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '100%',
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#757575',
    marginTop: 32,
  },
});

export default LivestockListScreen;