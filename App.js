import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3000/books', {
        name,
        detail,
      });
      console.log('Book created:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error creating book:', error.message);
    }
  };

  const handleEdit = (book) => {
    setSelectedBookId(book._id);
    setName(book.name);
    setDetail(book.detail);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/books/${selectedBookId}`, {
        name,
        detail,
      });
      console.log('Book updated:', response.data);
      setSelectedBookId(null);
      setName('');
      setDetail('');
      fetchData();
    } catch (error) {
      console.error('Error updating book:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      console.log('Book deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting book:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Detail:</Text>
      <TextInput
        style={styles.input}
        value={detail}
        onChangeText={(text) => setDetail(text)}
        placeholder="Enter detail"
        multiline
      />

      {selectedBookId ? (
        <Button title="Update" onPress={handleUpdate} />
      ) : (
        <Button title="Save" onPress={handleSave} />
      )}

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
            <Text style={styles.bookText}>{`Name: ${item.name}`}</Text>
            <Text style={styles.bookText}>{`Detail: ${item.detail}`}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item._id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default App;
