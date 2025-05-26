import { useAppSelector } from '@/store/redux';
import { useUserSideEffects } from './useAuth';

// Hook compuesto que maneja el estado completo de autenticación
export const useAuthState = () => {
  const authState = useAppSelector((state) => state.auth);
  const { data, error, isSuccess, isError } = useUserSideEffects();

  return {
    // Estado del Redux
    ...authState,
    // Estado de la query
    userQuery: {
      data,
      error,
      isSuccess,
      isError,
      isLoading: !isSuccess && !isError,
    }
  };
};
