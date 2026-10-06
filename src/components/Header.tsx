import { AppBar, Toolbar, Typography, Select, MenuItem, Chip, Box, Button } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setActiveRestaurant } from '../store/restaurantSlice';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeRestaurant, status } = useSelector((state: RootState) => state.restaurant);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setActiveRestaurant(event.target.value));
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={2}>
      <Toolbar>
        <Typography variant="h5" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          🍔 Ytasty Crousty
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button component={Link} to="/" size="small" variant="outlined">
            Espace équipe
          </Button>
          {activeRestaurant && (
            <Chip 
              label={activeRestaurant.is_open ? 'Ouvert' : 'Fermé'} 
              color={activeRestaurant.is_open ? 'success' : 'error'} 
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          <Select
            value={activeRestaurant?.id || ''}
            onChange={handleChange}
            size="small"
            displayEmpty
            disabled={status === 'loading' || list.length === 0}
            sx={{ minWidth: 150, borderRadius: 2 }}
          >
            {list.map((resto) => (
              <MenuItem key={resto.id} value={resto.id}>
                {resto.city}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};