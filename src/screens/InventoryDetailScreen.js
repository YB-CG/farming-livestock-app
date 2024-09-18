import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InventoryDetailScreen = ({ navigation, route }) => {
  const { productId } = route.params;
  // In a real app, you would fetch the product details using the productId
  // For this example, we'll use mock data
  const product = {
    id: productId,
    name: "Sample Product",
    description: "This is a sample product description.",
    price: "1000",
    stock: 10,
    category: "Sample Category",
    image: "https://example.com/sample-product.jpg"
  };

  const handleUpdate = () => {
    navigation.navigate('UpdateInventory', { productId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productInfo}>Price: ${product.price}</Text>
        <Text style={styles.productInfo}>Stock: {product.stock}</Text>
        <Text style={styles.productInfo}>Category: {product.category}</Text>
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Icon name="pencil" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  productInfo: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default InventoryDetailScreen;