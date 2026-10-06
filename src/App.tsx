import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal'; 
import { KitchenDashboard } from './components/KitchenDashboard';
import { fetchRestaurants } from './store/restaurantSlice';
import type { AppDispatch, RootState } from './store';

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAdminView, setIsAdminView] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchRestaurants());
    const handleToggleAdmin = () => setIsAdminView(prev => !prev);
    window.addEventListener('toggle-admin-view', handleToggleAdmin);
    return () => window.removeEventListener('toggle-admin-view', handleToggleAdmin);
  }, [dispatch]);

  // Si on se déconnecte, on repasse automatiquement côté client
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setIsAdminView(false);
    }
  }, [isAuthenticated, user]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <CartDrawer /> 
      <CheckoutModal />
      <AuthModal />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {isAdminView && isAuthenticated && user?.role === 'admin' ? <KitchenDashboard /> : <Catalog />}
      </Container>
    </Box>
  );
};

export default App;