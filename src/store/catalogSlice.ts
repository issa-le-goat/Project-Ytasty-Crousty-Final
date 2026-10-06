import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Le Crousty Classic', 
    description: 'Pain brioché, steak haché 150g, cheddar affiné, salade, tomate, sauce crousty maison.', 
    price: 8.90, 
    category: 'Burger', 
    image_url: 'https://www.mijoter.fr/wp-content/uploads/tasty-crousty-maison-1024x682.jpg',
    is_available: true
  },
  { 
    id: '2', 
    name: 'Le Veggie Gourmand', 
    description: 'Galette de légumes de saison, cheddar, avocat, oignons rouges caramélisés, sauce yaourt aux herbes.', 
    price: 9.50, 
    category: 'Burger', 
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop',
    is_available: false 
  },
  { 
    id: '3', 
    name: 'Menu Double Cheese', 
    description: 'Double steak, double cheddar, accompagné de frites croustillantes et boisson au choix.', 
    price: 13.50, 
    category: 'Menu', 
    image_url: 'https://steaknsmash.com/wp-content/uploads/2026/09/menu-double-cheese-steaknsmash-palaiseau-1-900x900.webp',
    is_available: true
  },
  { 
    id: '4', 
    name: 'Coca-Cola Zero', 
    description: 'Canette 33cl bien fraîche.', 
    price: 2.50, 
    category: 'Boisson', 
    image_url: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQwKZWI8A2t_dUOEL_Np2LNfnWuH3aKyeq26hdFOz1VBZVrJlcq43EzglRF5OaMD8lb6d_gqERkpI4OkkhHe-52pR_xkIY80JjK0om7DHIkRvD738eRZtzsWA',
    is_available: true
  }
];

export const fetchProductsByRestaurant = createAsyncThunk(
  'catalog/fetchProducts',
  async (_restaurantId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockProducts; 
  }
);

interface CatalogState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  searchTerm: string;
  categoryFilter: string;
}

const initialState: CatalogState = {
  items: [],
  status: 'idle',
  searchTerm: '',
  categoryFilter: 'Tous', 
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductsByRestaurant.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setSearchTerm, setCategoryFilter } = catalogSlice.actions;
export default catalogSlice.reducer;