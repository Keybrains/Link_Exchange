import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../config/AxiosInstanceAdmin';

const Category = () => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categorys/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post('/categorys/category', { category });
      toast.success('Category added successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsLoading(false);
    }

    setCategory('');
  };

  const handleDelete = async (categoryId) => {
    try {
      await axiosInstance.delete(`/categorys/category/${categoryId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    <Container component="main">
      <Typography component="h1" variant="h5">
        Add Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="category"
          label="Category Name"
          name="category"
          autoComplete="category"
          autoFocus
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isLoading}
          style={{ marginTop: '10px' }}
        >
          {isLoading ? 'Adding...' : 'Add Category'}
        </Button>
      </form>

      <Typography component="h2" variant="h6" style={{ marginTop: '10px' }}>
        Categories List
      </Typography>
      <Paper style={{ marginTop: '10px' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : categories
              ).map((cat, index) => (
                <TableRow key={cat.category_id}>
                  <TableCell component="th" scope="row">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{cat.category}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(cat.category_id)} color="error" size="small">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20, 25, { label: 'All', value: -1 }]}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => (
            <div style={{ fontSize: '14px', fontStyle: 'italic', marginTop: '5px' }}>
              Showing {from}-{to} of {count !== -1 ? count : 'more than'}
            </div>
          )}
          SelectProps={{
            style: { marginBottom: '10px' },
            renderValue: (value) => `${value} rows`,
          }}
          nextIconButtonProps={{
            style: {
              marginBottom: '5px',
            },
          }}
          backIconButtonProps={{
            style: {
              marginBottom: '5px',
            },
          }}
        />
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Category;
