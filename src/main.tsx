import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import App from './App.tsx';
// import { Provider } from 'react-redux';
// import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Réinitialise le CSS par défaut du navigateur */}
        <App />
      </ThemeProvider>
    {/* </Provider> */}
  </React.StrictMode>
);