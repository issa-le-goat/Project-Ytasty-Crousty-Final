import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Container, Typography } from '@mui/material';
import { Header } from './components/Header';
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Le Catalogue (Bientôt ici)
        </Typography>
      </Container>
    </Box>
  );
};

export default App;