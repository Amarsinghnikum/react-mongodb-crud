const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://amar:password1234@cluster0.jtlhba0.mongodb.net/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a MongoDB model (assuming you have a 'books' collection)
const Book = mongoose.model('Book', {
  name: String,
  detail: String,
});

// Define a route to handle book creation
app.post('/books', async (req, res) => {
  try {
    const { name, detail } = req.body;
    const newBook = new Book({ name, detail });
    await newBook.save();
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, detail } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(id, { name, detail }, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
