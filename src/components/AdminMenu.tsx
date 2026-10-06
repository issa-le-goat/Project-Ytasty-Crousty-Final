import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RootState, AppDispatch } from '../store';
import { toggleAvailability, deleteProduct } from '../store/catalogSlice';

export const AdminMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.catalog);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Gestion de la Carte</Typography>
      
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Produit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Catégorie</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Prix</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>En Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={product.image_url} alt={product.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    <Typography sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={product.category} size="small" /></TableCell>
                <TableCell>{product.price.toFixed(2)}€</TableCell>
                <TableCell align="center">
                  <Switch 
                    checked={product.is_available} 
                    onChange={() => dispatch(toggleAvailability(product.id))}
                    color="success"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => dispatch(deleteProduct(product.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Aucun produit dans le catalogue.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};