import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ProductCardProps {
  id: string;
  name: string;
  onPress: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
      <View style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.productName}>{name}</Text>
          <Text>ID: {id}</Text>
        </View>
        <FontAwesome name="chevron-right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    width: 200,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flexDirection: 'column',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductCard;
