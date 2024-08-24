import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search..."
      onChangeText={onChange}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 10,
  },
});

export default SearchBar;
