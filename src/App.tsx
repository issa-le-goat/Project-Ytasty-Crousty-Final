import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Container } from '@mui/material';
import { Header } from './components/Header';
import { Catalog } from './components/catalog';
import { fetchRestaurants } from './store/restaurantSlice';
import type { AppDispatch } from './store';

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Catalog />
      </Container>
    </Box>
  );
};

export default App;