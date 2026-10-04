import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Rouge fast-food (ouvre l'appétit)
    },
    secondary: {
      main: '#FFC107', // Jaune/Orange gourmand
    },
    background: {
      default: '#F5F5F5', // Fond gris très clair pour faire ressortir les cartes
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Empêche les boutons d'être en TOUT MAJUSCULES
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Boutons et cartes bien arrondis
  },
});