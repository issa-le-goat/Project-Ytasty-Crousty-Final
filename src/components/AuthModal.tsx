import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Alert, Box } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { login, register, closeAuthModal, clearError } from '../store/authSlice';

export const AuthModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthModalOpen, error } = useSelector((state: RootState) => state.auth);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => {
    dispatch(closeAuthModal());
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    if (isLoginMode) dispatch(login({ username, password }));
    else dispatch(register({ username, password }));
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    dispatch(clearError());
  };

  return (
    <Dialog open={isAuthModalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {isLoginMode ? 'Connexion' : 'Créer un compte'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Identifiant" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
          <TextField label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
          <Button type="submit" variant="contained" size="large">
            {isLoginMode ? 'Se connecter' : "S'inscrire"}
          </Button>
          <Button onClick={toggleMode} color="secondary">
            {isLoginMode ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};