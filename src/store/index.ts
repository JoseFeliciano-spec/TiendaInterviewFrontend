// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/auth/authSlice'; 
import authModalReducer from './slices/auth/authModalSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModal: authModalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Tipos inferidos del store según especificaciones del test de tienda
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Setup para TanStack Query
setupListeners(store.dispatch);
