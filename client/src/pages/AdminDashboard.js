import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
} from '../redux/slices/bookSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: [],
    publishedYear: '',
    isbn: '',
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleBookDialogOpen = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookForm({
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: book.coverImage,
        genre: book.genre,
        publishedYear: book.publishedYear,
        isbn: book.isbn,
      });
    } else {
      setEditingBook(null);
      setBookForm({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        genre: [],
        publishedYear: '',
        isbn: '',
      });
    }
    setIsBookDialogOpen(true);
  };

  const handleBookDialogClose = () => {
    setIsBookDialogOpen(false);
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      description: '',
      coverImage: '',
      genre: [],
      publishedYear: '',
      isbn: '',
    });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (editingBook) {
      await dispatch(updateBook({ id: editingBook._id, bookData: bookForm }));
    } else {
      await dispatch(createBook(bookForm));
    }
    handleBookDialogClose();
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await dispatch(deleteBook(bookId));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Books Management */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Books Management</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleBookDialogOpen()}
              >
                Add New Book
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Published Year</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre.join(', ')}</TableCell>
                      <TableCell>{book.publishedYear}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleBookDialogOpen(book)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteBook(book._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Book Dialog */}
      <Dialog
        open={isBookDialogOpen}
        onClose={handleBookDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <form onSubmit={handleBookSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Author"
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, author: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, description: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cover Image URL"
                  value={bookForm.coverImage}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, coverImage: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    multiple
                    value={bookForm.genre}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, genre: e.target.value })
                    }
                    label="Genre"
                  >
                    <MenuItem value="Fiction">Fiction</MenuItem>
                    <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                    <MenuItem value="Mystery">Mystery</MenuItem>
                    <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                    <MenuItem value="Romance">Romance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Published Year"
                  type="number"
                  value={bookForm.publishedYear}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, publishedYear: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ISBN"
                  value={bookForm.isbn}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, isbn: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBookDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 