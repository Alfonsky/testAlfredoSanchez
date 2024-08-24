import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

const EditProductScreen = ({ navigation }: { navigation: any }) => {
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  });
  const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
  const [showRevisionDatePicker, setShowRevisionDatePicker] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({}); // Estado para mensajes de error

  useEffect(() => {
    // Recuperar el ID del producto seleccionado desde el localStorage
    const fetchProduct = async () => {
      const selectedProductId = await AsyncStorage.getItem('selectedProductId');
      const productosList = JSON.parse(await AsyncStorage.getItem('productosList') || '[]');
      const producto = productosList.find((prod: Product) => prod.id === selectedProductId);

      if (producto) {
        // Formatear fechas para eliminar horas, minutos y segundos
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        };

        setProduct({
          ...producto,
          date_release: formatDate(producto.date_release),
          date_revision: formatDate(producto.date_revision),
        });
      }
    };

    fetchProduct();
  }, []);

  // Manejar cambios en el DateTimePicker
  const onDateChange = (event: any, selectedDate: Date | undefined, type: 'release' | 'revision') => {
    setShowReleaseDatePicker(false);
    setShowRevisionDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (type === 'release') {
        setProduct({ ...product, date_release: formattedDate });
      } else {
        setProduct({ ...product, date_revision: formattedDate });
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors: any = {};

    if (product) {
      // Validar ID
      if (product.id.length < 3 || product.id.length > 10) {
        errors.id = 'El ID debe tener entre 3 y 10 caracteres.';
        isValid = false;
      }

      // Validar Nombre
      if (product.name.length < 5 || product.name.length > 100) {
        errors.name = 'El nombre debe tener entre 5 y 100 caracteres.';
        isValid = false;
      }

      // Validar Descripción
      if (product.description.length < 10 || product.description.length > 200) {
        errors.description = 'La descripción debe tener entre 10 y 200 caracteres.';
        isValid = false;
      }

      // Validar Logo
      if (product.logo.trim() === '') {
        errors.logo = 'El campo Logo es requerido.';
        isValid = false;
      }

      // Validar Fechas
      const todayDate = new Date().toISOString().split('T')[0];
      if (product.date_release < todayDate) {
        errors.date_release = 'La fecha debe ser igual o mayor a la fecha actual.';
        isValid = false;
      }

      const releaseDate = new Date(product.date_release);
      const reviewDate = new Date(product.date_revision);
      const oneYearLater = new Date(releaseDate.setFullYear(releaseDate.getFullYear() + 1)).toISOString().split('T')[0];

      if (product.date_revision !== oneYearLater) {
        errors.date_revision = 'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.';
        isValid = false;
      }
    }

    setErrorMessages(errors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (product && validateForm()) {
      try {
        const authorId = '123456789'; 

        const response = await fetch(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorId': authorId,
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error('Error en la actualización del producto');
        }

        Alert.alert('Éxito', 'Producto actualizado correctamente');
        navigation.navigate('Home'); // Redirigir a la lista de productos o página principal
      } catch (error) {
        Alert.alert('Error', 'Error al actualizar el producto: ' + error.message);
      }
    }
  };

  const handleReset = () => {
    // Limpiar el AsyncStorage para esta página (opcional)
    AsyncStorage.removeItem('selectedProductId');
    // Redirigir a la página principal o de productos
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}><FontAwesome name="credit-card" size={24} color="black" /> BANCO</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Formulario de Edición</Text>
        {product && (
          <View>
            <Text>ID</Text>
            <TextInput
              style={[styles.input, errorMessages.id ? styles.errorInput : null]}
              value={product.id}
              editable={false}
            />
            {errorMessages.id && <Text style={styles.errorMessage}>{errorMessages.id}</Text>}
            
            <Text>Nombre</Text>
            <TextInput
              style={[styles.input, errorMessages.name ? styles.errorInput : null]}
              value={product.name}
              onChangeText={(text) => setProduct({ ...product, name: text })}
            />
            {errorMessages.name && <Text style={styles.errorMessage}>{errorMessages.name}</Text>}
            
            <Text>Descripción</Text>
            <TextInput
              style={[styles.input, errorMessages.description ? styles.errorInput : null]}
              value={product.description}
              onChangeText={(text) => setProduct({ ...product, description: text })}
            />
            {errorMessages.description && <Text style={styles.errorMessage}>{errorMessages.description}</Text>}
            
            <Text>Logo</Text>
            <TextInput
              style={[styles.input, errorMessages.logo ? styles.errorInput : null]}
              value={product.logo}
              onChangeText={(text) => setProduct({ ...product, logo: text })}
            />
            {errorMessages.logo && <Text style={styles.errorMessage}>{errorMessages.logo}</Text>}
            
            <Text>Fecha de Liberación</Text>
            <Button title={product.date_release || 'Seleccionar Fecha'} onPress={() => setShowReleaseDatePicker(true)} />
            {showReleaseDatePicker && (
              <DateTimePicker
                value={product.date_release ? new Date(product.date_release) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'release')}
              />
            )}

            <Text>Fecha de Revisión</Text>
            <Button title={product.date_revision || 'Seleccionar Fecha'} onPress={() => setShowRevisionDatePicker(true)} />
            {showRevisionDatePicker && (
              <DateTimePicker
                value={product.date_revision ? new Date(product.date_revision) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'revision')}
              />
            )}
            
            <View style={styles.buttonContainer}>
              <Button title="Actualizar" onPress={handleUpdate} color="yellow" />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',  // Asegúrate de que el contenedor se alinee al centro
    width: '100%',          // Asegura que el contenedor ocupe todo el ancho disponible
    justifyContent: 'center', // Centra el contenido horizontalmente
    color:'black'
  },
});

export default EditProductScreen;
