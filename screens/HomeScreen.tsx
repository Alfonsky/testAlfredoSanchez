import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products', {
        headers: {
          'authorId': '123456789',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
      await AsyncStorage.setItem('productosList', JSON.stringify(data));
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}><FontAwesome name="credit-card" size={24} color="black" /> BANCO</Text>
      <SearchBar onChange={text => setSearchTerm(text)} />
      <Text style={styles.total}>Total de registros: {filteredProducts.length}</Text>
      <ScrollView contentContainerStyle={styles.productsContainer}>
        {loading ? (
          <View style={styles.skeletonContainer}>
            {[1, 2, 3].map((_, index) => (
              <LinearGradient
                key={index}
                colors={['#e0e0e0', '#f5f5f5', '#e0e0e0']}
                style={styles.skeletonCard}
                start={[0, 0]}
                end={[1, 1]}
              />
            ))}
          </View>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              onPress={(id) => {
                AsyncStorage.setItem('selectedProductId', id);
                navigation.navigate('Detail');
              }}
            />
          ))
        )}
      </ScrollView>
      <Button
        title="Agregar"
        color="yellow"
        onPress={() => navigation.navigate('Add')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  total: {
    fontSize: 16,
    marginVertical: 10,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skeletonCard: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
  },
});

export default HomeScreen;
