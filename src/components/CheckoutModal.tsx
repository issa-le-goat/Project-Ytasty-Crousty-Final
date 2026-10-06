import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, ToggleButtonGroup, ToggleButton, Stepper, Step, StepLabel } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { closeCheckout, setDiningOption, placeOrder, syncClientStep } from '../store/orderSlice';
import { openAuthModal } from '../store/authSlice';
import { clearCart, toggleCart } from '../store/cartSlice';

const STEPS = ['En attente', 'En préparation', 'Prêt'];

export const CheckoutModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCheckoutOpen, diningOption, currentOrderId, activeStep } = useSelector((state: RootState) => state.order);
  const { items } = useSelector((state: RootState) => state.cart);
  const { activeRestaurant } = useSelector((state: RootState) => state.restaurant);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentOrderId) {
      const interval = setInterval(() => dispatch(syncClientStep()), 1000);
      return () => clearInterval(interval);
    }
  }, [currentOrderId, dispatch]);

  const handleValidation = () => {
    if (diningOption && activeRestaurant && user) {
      dispatch(placeOrder({ restaurantId: activeRestaurant.id, customerName: user.username, items }));
      dispatch(clearCart());
      dispatch(toggleCart());
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onClose={() => dispatch(closeCheckout())} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {currentOrderId ? `Commande confirmée !` : 'Validation de commande'}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {!currentOrderId ? (
          <>
            {!isAuthenticated || user?.role === 'admin' ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography sx={{ mb: 3 }}>
                  {user?.role === 'admin' 
                    ? "Les administrateurs ne peuvent pas passer de commande client." 
                    : "Veuillez vous connecter avec un compte client pour commander."}
                </Typography>
                {!isAuthenticated && (
                  <Button variant="contained" onClick={() => dispatch(openAuthModal())}>
                    Se connecter / S'inscrire
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ mb: 2 }}>Comment souhaitez-vous déguster votre repas, <b>{user.username}</b> ?</Typography>
                <ToggleButtonGroup color="primary" value={diningOption} exclusive onChange={(_, v) => { if (v) dispatch(setDiningOption(v)); }} sx={{ width: '100%' }}>
                  <ToggleButton value="sur_place" sx={{ flex: 1, fontWeight: 'bold' }}>🍽️ Sur place</ToggleButton>
                  <ToggleButton value="a_emporter" sx={{ flex: 1, fontWeight: 'bold' }}>🛍️ À emporter</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ width: '100%', py: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>
            {activeStep === 2 && <Typography color="success.main" variant="h6" align="center" sx={{ mt: 4, fontWeight: 'bold' }}>Bon appétit ! 🍔</Typography>}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        {!currentOrderId ? (
          <>
            <Button onClick={() => dispatch(closeCheckout())} color="inherit">Annuler</Button>
            <Button variant="contained" disabled={!diningOption || !isAuthenticated || user?.role === 'admin'} onClick={handleValidation}>
              Confirmer la commande
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => dispatch(closeCheckout())}>Fermer le suivi</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};