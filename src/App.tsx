import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Container } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import { fetchRestaurants } from './store/restaurantSlice';
import type { AppDispatch } from './store';

const BackOffice = lazy(() => import('../frontend/src/App'));

const BackOfficePage = () => (
  <Suspense fallback={<Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}><CircularProgress aria-label="Chargement du back-office" /></Box>}>
    <BackOffice />
  </Suspense>
);

const CatalogPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      
      {/* Notre nouveau composant Panier qui est caché par défaut */}
      <CartDrawer /> 
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Catalog />
      </Container>
    </Box>
  );
};

export const App = () => (
  <Routes>
    <Route path="/" element={<BackOfficePage />} />
    <Route path="/backoffice/*" element={<BackOfficePage />} />
    <Route path="/catalogue" element={<CatalogPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;