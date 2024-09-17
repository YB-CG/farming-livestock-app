import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const categories = [
  {
    id: 1,
    name: "Feed",
    description: "Animal feed for various livestock, including grains and supplements.",
    icon: "food-variant"
  },
  {
    id: 2,
    name: "Vaccines",
    description: "Vaccines and other medical supplies for livestock health management.",
    icon: "needle"
  },
  {
    id: 3,
    name: "Equipment",
    description: "Farming tools and machinery used in livestock operations.",
    icon: "tractor"
  },
  {
    id: 4,
    name: "Fencing Materials",
    description: "Supplies for building and maintaining enclosures for livestock.",
    icon: "fence"
  }
];

const mockProducts = [
  { id: 1, name: "Corn Feed", image: "https://example.com/corn-feed.jpg", stock: 500, category_id: 1 },
  { id: 2, name: "Foot and Mouth Vaccine", image: "https://example.com/fmv.jpg", stock: 100, category_id: 2 },
  { id: 3, name: "Tractor", image: "https://example.com/tractor.jpg", stock: 5, category_id: 3 },
  { id: 4, name: "Barbed Wire", image: "https://example.com/barbed-wire.jpg", stock: 1000, category_id: 4 },
];

const InventoryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon name={item.icon} size={40} color="#4CAF50" />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryDescription} numberOfLines={2}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredProducts = selectedCategory
    ? mockProducts.filter(product => product.category_id === selectedCategory)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Livestock Inventory</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct', { categories })}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {selectedCategory && (
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>
            Products in {categories.find(cat => cat.id === selectedCategory)?.name}
          </Text>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productsList}
          />
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
  productSection: {
    marginTop: 20,
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