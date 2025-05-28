import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number; // Ya en pesos (convertido de centavos)
  originalPrice?: number;
  image: string;
  stock: number;
  slug: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

// Estado inicial simple
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Función helper fuera del slice para evitar problemas con Immer
const calculateCartTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return { totalQuantity, totalAmount };
};

// Función para guardar en localStorage
const saveToLocalStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tienda_cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

const cartSlice = createSlice({
  name: 'tienda_cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      // 🔥 Calcular totales directamente sin referencias circulares
      const totals = calculateCartTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      
      // Guardar en localStorage
      saveToLocalStorage(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalcular totales
      const totals = calculateCartTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      
      saveToLocalStorage(state);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        
        // Recalcular totales
        const totals = calculateCartTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        saveToLocalStorage(state);
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(i => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
        
        // Recalcular totales
        const totals = calculateCartTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        saveToLocalStorage(state);
      }
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
        
        // Recalcular totales
        const totals = calculateCartTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        
        saveToLocalStorage(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      saveToLocalStorage(state);
    },

    // 🔥 Acción para restaurar desde localStorage
    restoreCart: (state, action: PayloadAction<CartState>) => {
      const restoredState = action.payload;
      state.items = restoredState.items;
      state.totalQuantity = restoredState.totalQuantity;
      state.totalAmount = restoredState.totalAmount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  clearCart,
  restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;
