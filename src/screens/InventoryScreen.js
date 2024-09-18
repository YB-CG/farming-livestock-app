import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCategories, getProductsByCategory } from '../services/api';
import Loader from '../components/Loader';

const categoryIcons = {
  "Feed": "food-variant",
  "Vaccines": "needle",
  "Equipment": "tractor",
  "Fencing Materials": "fence",
};

const InventoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategories();
      setCategories(response.data.results);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      setIsFetchingProducts(true);
      const response = await getProductsByCategory(categoryId);
      setProducts(response.data.results);
    } catch (error) {
      // console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const renderCategoryCard = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}
        onPress={() => handleCategoryPress(item.id)}
      >
        <Icon 
          name={categoryIcons[item.name] || 'help-circle'} 
          size={40} 
          color={isSelected ? "#FFFFFF" : "#4CAF50"} 
        />
        <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>{item.name}</Text>
        <Text style={[styles.categoryDescription, isSelected && styles.selectedCategoryText]} numberOfLines={2}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('InventoryDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Livestock Inventory</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddInventory', { categories })}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={filterText}
            onChangeText={setFilterText}
          />
          
      <Text style={styles.sectionTitle}>Categories</Text>
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          ListEmptyComponent={<Text>No categories found</Text>}
        />
      )}

      {selectedCategory && (
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>
            Products in {categories.find(cat => cat.id === selectedCategory)?.name}
          </Text>

          {isFetchingProducts ? (
            <Loader />
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.productsList}
              ListEmptyComponent={<Text>No products found in this category</Text>}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoriesList: {
    paddingVertical: 10,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryCard: {
    backgroundColor: '#4CAF50',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  productSection: {
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
});

export default InventoryScreen;