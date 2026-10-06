import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, Badge, Button } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { setActiveRestaurant } from '../store/restaurantSlice';
import { toggleCart } from '../store/cartSlice';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeRestaurant } = useSelector((state: RootState) => state.restaurant);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // On calcule combien d'articles au total sont dans le panier pour le petit badge rouge
  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🍔 Ytasty Crousty
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
          {/* SÉLECTEUR DE RESTAURANT */}
          <FormControl variant="standard" sx={{ minWidth: { xs: 120, md: 200 } }}>
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

          {/* BOUTON DU PANIER */}
          <Button 
            color="inherit" 
            onClick={() => dispatch(toggleCart())}
            sx={{ fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, px: 2 }}
          >
            <Badge badgeContent={totalCartQuantity} color="error" sx={{ mr: 1 }}>
              🛒
            </Badge>
            Panier
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};