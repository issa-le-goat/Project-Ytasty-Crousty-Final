import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress, TextField, Chip } from '@mui/material';
import type { RootState, AppDispatch } from '../store';
import { fetchProductsByRestaurant, setSearchTerm, setCategoryFilter } from '../store/catalogSlice';
import { addToCart } from '../store/cartSlice';

// Nos catégories disponibles
const CATEGORIES = ['Tous', 'Menu', 'Burger', 'Boisson'];

export const Catalog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, searchTerm, categoryFilter } = useSelector((state: RootState) => state.catalog);
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

  // --- LOGIQUE DE FILTRAGE ---
  const filteredItems = items.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'Tous' || product.category === categoryFilter;
    
    return matchSearch && matchCategory;
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Menu de {activeRestaurant.city}
      </Typography>
      
      {/* BARRE DE RECHERCHE ET FILTRES */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, alignItems: { xs: 'stretch', sm: 'center' } }}>
        <TextField 
          label="Rechercher un produit..." 
          variant="outlined" 
          size="small"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          sx={{ minWidth: 250, backgroundColor: 'white', borderRadius: 1 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <Chip 
              key={cat} 
              label={cat} 
              onClick={() => dispatch(setCategoryFilter(cat))}
              color={categoryFilter === cat ? 'primary' : 'default'}
              variant={categoryFilter === cat ? 'filled' : 'outlined'}
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* RÉSULTATS */}
      {filteredItems.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Aucun produit ne correspond à votre recherche.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filteredItems.map((product) => (
            <Card 
              key={product.id} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 3, 
                elevation: 3,
                opacity: product.is_available ? 1 : 0.6 
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image_url}
                  alt={product.name}
                  sx={{ objectFit: 'cover', filter: product.is_available ? 'none' : 'grayscale(80%)' }}
                />
                {!product.is_available && (
                  <Chip 
                    label="Épuisé" 
                    color="error" 
                    sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }} 
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', ml: 2 }}>
                    {product.price.toFixed(2)}€
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                  {product.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color={product.is_available ? "primary" : "inherit"}
                  disabled={!product.is_available} 
                  fullWidth 
                  onClick={() => dispatch(addToCart(product))}
                  sx={{ borderRadius: 2, fontWeight: 'bold', py: 1 }}
                >
                  {product.is_available ? 'Ajouter au panier' : 'Indisponible'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};