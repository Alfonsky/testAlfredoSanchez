import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

const ProductDetailScreen = ({ route, navigation }: any) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const selectedProductId = await AsyncStorage.getItem('selectedProductId');
      const productosList = JSON.parse(await AsyncStorage.getItem('productosList') || '[]');
      const producto = productosList.find((prod: Product) => prod.id === selectedProductId);

      if (producto) {
        setProduct(producto);
      }
    };

    fetchProduct();
  }, []);

  const handleDelete = async () => {
    try {
      const selectedProductId = await AsyncStorage.getItem('selectedProductId');
      if (!selectedProductId) {
        Alert.alert('Error', 'ID de producto no encontrado.');
        return;
      }

      const apiUrl = `https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products`;

      const response = await fetch(`${apiUrl}?id=${selectedProductId}`, {
        method: 'DELETE',
        headers: {
          'authorId': '123456789',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Producto eliminado con éxito.');
        setModalVisible(false);
        navigation.navigate('Home');
      } else {
        throw new Error('Error al eliminar el producto.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el producto. Por favor, intenta nuevamente.');
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <View style={styles.container}>
      {product ? (
        <View style={styles.productDetail}>
          <Text><Text style={styles.label}>ID:</Text> {product.id}</Text>
          <Text><Text style={styles.label}>Nombre:</Text> {product.name}</Text>
          <Text><Text style={styles.label}>Descripción:</Text> {product.description}</Text>
          <Text><Text style={styles.label}>Logo:</Text></Text>
          <Image source={{ uri: product.logo }} style={styles.logo} />
          <Text><Text style={styles.label}>Fecha Liberación:</Text> {product.date_release}</Text>
          <Text><Text style={styles.label}>Fecha Revisión:</Text> {product.date_revision}</Text>
          <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Editar"
              onPress={() => navigation.navigate('EditProduct')}
              color="gray"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Eliminar"
              onPress={() => setModalVisible(true)}
              color="red"
            />
          </View>
        </View>

          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>¿Estás seguro de que deseas eliminar el producto <Text style={styles.modalTitle}>{product.name}</Text>?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    title="Confirmar"
                    onPress={handleDelete}
                    color="yellow"
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => setModalVisible(false)}
                    color="#ccc"
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <Text>Producto no encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  productDetail: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  buttonWrapper: {
    marginVertical: 8, // Espacio vertical entre los botones
  },
  button: {
    marginVertical: 8, // Agrega margen vertical para separar los botones
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'column', // Disponer los botones en una columna
    alignItems: 'center', // Centrar horizontalmente
    justifyContent: 'space-between', // Espacio vertical entre los botones
    height: 120, // Ajusta la altura para proporcionar suficiente espacio entre botones
  },
});

export default ProductDetailScreen;
