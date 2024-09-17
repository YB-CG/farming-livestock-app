import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import { CircularProgress } from 'react-native-circular-progress';
import {getProducts, getCategories} from '../services/api';

const InventoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
    //   use getCategories function from api.js to fetch categories
        const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
    //   use getProducts function from api.js to fetch products
        const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setSelectedCategory(category.id)}
      style={styles.categoryButton}
    >
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = (product) => (
    <View key={product.id} style={styles.productItem}>
      <Text style={styles.productName}>{product.name}</Text>
      <CircularProgress
        size={80}
        fill={product.stock / product.quantity * 100}
        width={10}
        tintColor="#4CAF50"
        backgroundColor="#E0E0E0"
      />
      <Text style={styles.stockText}>Stock: {product.stock}</Text>
      <Text style={styles.priceText}>Price: ${product.price}</Text>
    </View>
  );

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
        <Text style={styles.title}>Inventory Management</Text>

        <View style={styles.categories}>
          {categories.map(renderCategory)}
        </View>

        <View style={styles.products}>
          {products
            .filter(product => !selectedCategory || product.category === selectedCategory)
            .map(renderProduct)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consumption Trends</Text>
          <BarChart
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
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
  },
  products: {
    padding: 20,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default InventoryScreen;
