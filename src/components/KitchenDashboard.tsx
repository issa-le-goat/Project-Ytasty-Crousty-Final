import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Tabs, Tab } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { updateOrderStatus } from '../store/orderSlice';
import { AdminMenu } from './AdminMenu';

export const KitchenDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentTab, setCurrentTab] = useState(0);

  const { allOrders } = useSelector((state: RootState) => state.order);
  const { activeRestaurant } = useSelector((state: RootState) => state.restaurant);

  const restaurantOrders = allOrders.filter(o => o.restaurantId === activeRestaurant?.id);
  const pendingOrders = restaurantOrders.filter(o => o.status === 'pending');
  const preparingOrders = restaurantOrders.filter(o => o.status === 'preparing');

  const advanceStatus = (orderId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'preparing' : 'ready';
    dispatch(updateOrderStatus({ orderId, status: nextStatus as any }));
  };

  const renderColumn = (title: string, columnOrders: typeof allOrders, color: string) => (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, minHeight: '60vh', borderTop: `5px solid ${color}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>{title} ({columnOrders.length})</Typography>
        {columnOrders.map(order => (
          <Card key={order.id} sx={{ mb: 2, backgroundColor: '#f9f9f9', elevation: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Commande #{order.id}</Typography>
                <Chip label={order.type === 'sur_place' ? 'Sur place' : 'À emporter'} color="secondary" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Client : {order.customerName}</Typography>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                {order.items.map((item, index) => <li key={index}><Typography>{item.name} x{item.quantity}</Typography></li>)}
              </ul>
              <Button variant="contained" fullWidth color={order.status === 'pending' ? 'warning' : 'success'} onClick={() => advanceStatus(order.id, order.status)}>
                {order.status === 'pending' ? 'Commencer la préparation' : 'Marquer comme Prêt'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Espace Staff - {activeRestaurant?.city || 'Aucun restaurant sélectionné'}
        </Typography>
        <Button variant="outlined" color="error" onClick={() => dispatch(logout())}>Déconnexion</Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Cuisine (Commandes)" sx={{ fontWeight: 'bold' }} />
          <Tab label="Gestion de la Carte" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Box>
      {currentTab === 0 && (
        <Grid container spacing={4}>
          {renderColumn('En attente', pendingOrders, '#ff9800')}
          {renderColumn('En préparation', preparingOrders, '#4caf50')}
        </Grid>
      )}
      {currentTab === 1 && <AdminMenu />}
    </Box>
  );
};