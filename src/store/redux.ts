import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '@/store';

// Hooks tipados según mejores prácticas oficiales de Redux Toolkit
// Estos reemplazan a useDispatch y useSelector en toda tu app

// Para React Redux v9.1.0+ con .withTypes() (método más nuevo)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Alternativa para versiones anteriores de React Redux (si .withTypes() no funciona)
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppStore: () => AppStore = useStore;
