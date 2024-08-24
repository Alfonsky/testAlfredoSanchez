import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';


export default function App() {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logo, setLogo] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [reviewDate, setReviewDate] = useState(new Date());
  const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
  const [showReviewDatePicker, setShowReviewDatePicker] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const navigation = useNavigation();

  const validateId = async (id:string) => {
    if (id.length < 3 || id.length > 10) {
      return 'El ID debe tener entre 3 y 10 caracteres.';
    }
    try {
      const response = await fetch(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=${encodeURIComponent(id)}`);
      const exists = await response.json();
      return exists ? 'ID ya existe.' : '';
    } catch {
      return 'Error en la verificación del ID.';
    }
  };

  const validateNombre = (nombre:string) => {
    return nombre.length < 5 || nombre.length > 100
      ? 'El nombre debe tener entre 5 y 100 caracteres.'
      : '';
  };

  const validateDescripcion = (descripcion:string) => {
    return descripcion.length < 10 || descripcion.length > 200
      ? 'La descripción debe tener entre 10 y 200 caracteres.'
      : '';
  };

  const validateLogo = (logo:string) => {
    return logo.trim() === ''
      ? 'El campo Logo es requerido.'
      : '';
  };

  const validateDate = (date:string) => {
    const today = new Date().toISOString().split('T')[0];
    return date < today
      ? 'La fecha debe ser igual o mayor a la fecha actual.'
      : '';
  };

  const validateDateRev = (revDate:string, releaseDate:string) => {
    const release = new Date(releaseDate);
    const review = new Date(revDate);
    const oneYearLater = new Date(release);
    oneYearLater.setFullYear(release.getFullYear() + 1);
    const formattedOneYearLater = oneYearLater.toISOString().split('T')[0];
    return review.toISOString().split('T')[0] !== formattedOneYearLater
      ? 'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.'
      : '';
  };

  const handleSubmit = async () => {
    const idValidationMessage = await validateId(id);
    const nombreValidationMessage = validateNombre(nombre);
    const descripcionValidationMessage = validateDescripcion(descripcion);
    const logoValidationMessage = validateLogo(logo);
    const dateValidationMessage = validateDate(releaseDate.toISOString().split('T')[0]);
    const dateRevValidationMessage = await validateDateRev(reviewDate.toISOString().split('T')[0], releaseDate.toISOString().split('T')[0]);

    setErrorMessages({
      id: idValidationMessage,
      nombre: nombreValidationMessage,
      descripcion: descripcionValidationMessage,
      logo: logoValidationMessage,
      releaseDate: dateValidationMessage,
      reviewDate: dateRevValidationMessage,
    });

    if (!idValidationMessage && !nombreValidationMessage && !descripcionValidationMessage && !logoValidationMessage && !dateValidationMessage && !dateRevValidationMessage) {
      try {
        const response = await fetch('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorId': '123456789', // Cambia este valor según sea necesario
          },
          body: JSON.stringify({
            id,
            name: nombre,
            description: descripcion,
            logo,
            date_release: releaseDate.toISOString().split('T')[0],
            date_revision: reviewDate.toISOString().split('T')[0],
          }),
        });
        if (!response.ok) {
          throw new Error('Error al enviar los datos.');
        }
        Alert.alert('Éxito', 'Datos enviados con éxito.', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.container2}>
      <Text style={styles.title}><FontAwesome name="credit-card" size={24} color="black" /> BANCO</Text>
      <View style={styles.form}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={[styles.input, errorMessages.id ? styles.error : null]}
          value={id}
          onChangeText={setId}
        />
        {errorMessages.id && <Text style={styles.errorMessage}>{errorMessages.id}</Text>}

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errorMessages.nombre ? styles.error : null]}
          value={nombre}
          onChangeText={setNombre}
        />
        {errorMessages.nombre && <Text style={styles.errorMessage}>{errorMessages.nombre}</Text>}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, errorMessages.descripcion ? styles.error : null]}
          value={descripcion}
          onChangeText={setDescripcion}
        />
        {errorMessages.descripcion && <Text style={styles.errorMessage}>{errorMessages.descripcion}</Text>}

        <Text style={styles.label}>Logo</Text>
        <TextInput
          style={[styles.input, errorMessages.logo ? styles.error : null]}
          value={logo}
          onChangeText={setLogo}
        />
        {errorMessages.logo && <Text style={styles.errorMessage}>{errorMessages.logo}</Text>}

        <Text style={styles.label}>Fecha Liberación</Text>
        <Button title={`Seleccionar Fecha de Liberación (${releaseDate.toLocaleDateString()})`} onPress={() => setShowReleaseDatePicker(true)} />
        {showReleaseDatePicker && (
          <DateTimePicker
            value={releaseDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowReleaseDatePicker(false);
              setReleaseDate(date || releaseDate);
            }}
          />
        )}
        {errorMessages.releaseDate && <Text style={styles.errorMessage}>{errorMessages.releaseDate}</Text>}

        <Text style={styles.label}>Fecha Revisión</Text>
        <Button title={`Seleccionar Fecha de Revisión (${reviewDate.toLocaleDateString()})`} onPress={() => setShowReviewDatePicker(true)} />
        {showReviewDatePicker && (
          <DateTimePicker
            value={reviewDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowReviewDatePicker(false);
              setReviewDate(date || reviewDate);
            }}
          />
        )}
        {errorMessages.reviewDate && <Text style={styles.errorMessage}>{errorMessages.reviewDate}</Text>}

        <View style={styles.containerhui}>
      <Button title="Enviar" onPress={handleSubmit} color="yellow" />
      <View style={styles.spacing} />
      <Button
        title="Reiniciar"
        onPress={() => {
          setId('');
          setNombre('');
          setDescripcion('');
          setLogo('');
          setReleaseDate(new Date());
          setReviewDate(new Date());
          setErrorMessages({});
        }}
        color="gray"
      />
    </View>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerhui: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    height: 20, // Ajusta la altura según la separación que desees
  },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
      },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
});
