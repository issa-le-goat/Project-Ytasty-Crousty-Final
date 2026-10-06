import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, ToggleButton, ToggleButtonGroup, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { closeCheckout, setDiningOption, submitOrder, advanceStep } from '../store/orderSlice';
import { clearCart, toggleCart } from '../store/cartSlice';
import { socket } from '../api/socket'; // Ajout de l'import Socket.io

const STEPS = ['En attente de validation', 'En préparation', 'Prêt à être retiré'];

export const CheckoutModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCheckoutOpen, diningOption, status, orderNumber, activeStep } = useSelector((state: RootState) => state.order);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleValidation = async () => {
    if (diningOption) {
      await dispatch(submitOrder({ type: diningOption, items: cartItems }));
      dispatch(clearCart());
      dispatch(toggleCart());
    }
  };

  const handleClose = () => {
    if (status !== 'submitting') {
      dispatch(closeCheckout());
    }
  };

  // --- LOGIQUE TEMPS RÉEL SOCKET.IO ---
  useEffect(() => {
    // Si la commande est validée, on se connecte aux WebSockets
    if (status === 'succeeded' && orderNumber) {
      socket.connect();

      // On écoute l'événement 'order_updated' envoyé par la cuisine (l'Étudiant 3)
      socket.on('order_updated', (data: { id: number, step: number }) => {
        if (data.id === orderNumber) {
          // Si c'est notre commande, on fait avancer le Stepper
          dispatch(advanceStep());
        }
      });

      // Nettoyage à la fermeture
      return () => {
        socket.off('order_updated');
        socket.disconnect();
      };
    }
  }, [status, orderNumber, dispatch]);

  return (
    <Dialog open={isCheckoutOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {status === 'succeeded' ? `Commande #${orderNumber} confirmée !` : 'Validation de votre commande'}
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        {status === 'idle' && (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Comment souhaitez-vous déguster votre repas ?
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={diningOption}
              exclusive
              onChange={(_, value) => { if (value) dispatch(setDiningOption(value)); }}
              sx={{ width: '100%', mb: 2 }}
            >
              <ToggleButton value="sur_place" sx={{ flex: 1, fontWeight: 'bold' }}>🍽️ Sur place</ToggleButton>
              <ToggleButton value="a_emporter" sx={{ flex: 1, fontWeight: 'bold' }}>🛍️ À emporter</ToggleButton>
            </ToggleButtonGroup>
          </>
        )}

        {status === 'submitting' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography>Transmission en cuisine...</Typography>
          </Box>
        )}

        {status === 'succeeded' && (
          <Box sx={{ width: '100%', py: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {/* Le bouton manuel reste là en attendant que le back-end de l'équipe soit terminé */}
            {activeStep < 2 && (
              <Button 
                variant="text" 
                color="secondary" 
                fullWidth 
                sx={{ mt: 4 }} 
                onClick={() => dispatch(advanceStep())}
              >
                (Dev: Simuler l'avancement cuisine)
              </Button>
            )}
            {activeStep === 2 && (
              <Typography color="success.main" variant="h6" align="center" sx={{ mt: 4, fontWeight: 'bold' }}>
                Bon appétit ! 🍔
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        {status === 'idle' && (
          <>
            <Button onClick={handleClose} color="inherit">Annuler</Button>
            <Button 
              variant="contained" 
              disabled={!diningOption} 
              onClick={handleValidation}
            >
              Confirmer la commande
            </Button>
          </>
        )}
        {status === 'succeeded' && (
          <Button variant="contained" onClick={handleClose}>Fermer le suivi</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};