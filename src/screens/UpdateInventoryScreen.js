import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

const UpdateInventoryScreen = ({ navigation, route }) => {
  const { productId, categories } = route.params;
  // In a real app, you would fetch the product details using the productId
  // For this example, we'll use mock data
  const initialProduct = {
    id: productId,
    name: "Sample Product",
    description: "This is a sample product description.",
    price: "1000",
    stock: "10",
    category: "4ec6e7ac-1ab9-41cb-8cb9-466245b52303"
  };

  const [name, setName] = useState(initialProduct.name);
  const [description, setDescription] = useState(initialProduct.description);
  const [price, setPrice] = useState(initialProduct.price);
  const [stock, setStock] = useState(initialProduct.stock.toString());
  const [category, setCategory] = useState(initialProduct.category);

  const handleUpdateProduct = () => {
    // Here you would typically make an API call to update the product
    console.log({ id: productId, name, description, price, stock, category });
    navigation.goBack();
  };

  const handleDeleteProduct = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            // Here you would typically make an API call to delete the product
            console.log(`Deleting product with id: ${productId}`);
            navigation.navigate('Inventory');
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Update Product</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Stock"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          {(categories || []).map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
        
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduct}>
          <Text style={styles.buttonText}>Update Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProduct}>
          <Text style={styles.buttonText}>Delete Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateInventoryScreen;