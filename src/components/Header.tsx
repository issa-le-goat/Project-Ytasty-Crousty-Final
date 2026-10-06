import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, Badge, Button, Chip } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { setActiveRestaurant } from '../store/restaurantSlice';
import { toggleCart } from '../store/cartSlice';
import { openAuthModal, logout } from '../store/authSlice';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeRestaurant } = useSelector((state: RootState) => state.restaurant);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          🍔 Ytasty Crousty
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
          <FormControl variant="standard" sx={{ minWidth: { xs: 100, md: 150 } }}>
            <Select
              value={activeRestaurant?.id || ''}
              onChange={(e) => dispatch(setActiveRestaurant(e.target.value))}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' }, fontWeight: 'bold' }}
              disableUnderline
            >
              {list.map((resto) => (
                <MenuItem key={resto.id} value={resto.id}>
                  {resto.city} {resto.is_open ? '' : '(Fermé)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isAuthenticated ? (
            <Button color="inherit" onClick={() => dispatch(openAuthModal())} sx={{ fontWeight: 'bold' }}>
              Connexion
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={user?.username} color="secondary" sx={{ fontWeight: 'bold' }} />
              <Button color="inherit" size="small" onClick={() => dispatch(logout())}>Déconnexion</Button>
            </Box>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Button 
              color="inherit" 
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-view'))}
              sx={{ fontWeight: 'bold', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: 2, px: 1 }}
            >
              👨‍🍳 Staff
            </Button>
          )}

          {/* BOUTON PANIER */}
          <Button 
            color="inherit" 
            onClick={() => dispatch(toggleCart())}
            sx={{ fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, px: 2 }}
          >
            <Badge badgeContent={totalCartQuantity} color="error" sx={{ mr: 1 }}>🛒</Badge>
            Panier
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};