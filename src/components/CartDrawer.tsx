import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Box, Typography, Button, Divider, List, ListItem, Badge } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { toggleCart, addToCart, removeFromCart, clearCart } from '../store/cartSlice';

export const CartDrawer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  // Calcul du prix total et du nombre d'articles
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Drawer anchor="right" open={isOpen} onClose={() => dispatch(toggleCart())}>
      <Box sx={{ width: { xs: 320, sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* EN-TÊTE DU PANIER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Mon Panier</Typography>
          <Button onClick={() => dispatch(toggleCart())} color="inherit" sx={{ minWidth: 'auto' }}>
            Fermer
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        {/* LISTE DES PRODUITS */}
        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Votre panier est vide.
          </Typography>
        ) : (
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {items.map((item) => (
              <ListItem key={item.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2, p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Typography fontWeight="bold">{item.name}</Typography>
                  <Typography fontWeight="bold" color="primary">
                    {(item.price * item.quantity).toFixed(2)}€
                  </Typography>
                </Box>
                
                {/* CONTRÔLE DES QUANTITÉS */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button size="small" variant="outlined" onClick={() => dispatch(removeFromCart(item.id))}>-</Button>
                  <Typography fontWeight="bold">{item.quantity}</Typography>
                  <Button size="small" variant="outlined" onClick={() => dispatch(addToCart(item))}>+</Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {/* PIED DU PANIER (Total et Validation) */}
        {items.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total :</Typography>
              <Typography variant="h6" fontWeight="bold">{totalAmount.toFixed(2)}€</Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth 
              sx={{ mb: 1 }} 
              onClick={() => dispatch(clearCart())}
            >
              Vider le panier
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large" 
              sx={{ fontWeight: 'bold', py: 1.5 }}
            >
              Commander ({totalItems})
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};