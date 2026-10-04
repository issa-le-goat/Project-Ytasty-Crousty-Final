import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { fetchProductsByRestaurant } from '../store/catalogSlice';

export const Catalog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.catalog);
  const activeRestaurant = useSelector((state: RootState) => state.restaurant.activeRestaurant);

  useEffect(() => {
    if (activeRestaurant) {
      dispatch(fetchProductsByRestaurant(activeRestaurant.id));
    }
  }, [activeRestaurant, dispatch]);

  if (!activeRestaurant) {
    return (
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
        Veuillez sélectionner un restaurant pour voir le catalogue.
      </Typography>
    );
  }

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Menu de {activeRestaurant.city}
      </Typography>
      
      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Aucun produit disponible pour ce restaurant actuellement.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {items.map((product) => (
            <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, elevation: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', ml: 2 }}>
                    {product.price}€
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                  {product.description}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 2, fontWeight: 'bold', py: 1 }}>
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};