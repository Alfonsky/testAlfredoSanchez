import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  roundedInput: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    boxSizing: 'border-box',
  },
  btnEditar: {
    backgroundColor: 'gray',
    borderRadius: 8,
    color: 'black',
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  btnEliminar: {
    backgroundColor: 'red',
    borderRadius: 8,
    color: 'black',
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    width: 200,
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flexDirection: 'column',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
});

export default styles;
