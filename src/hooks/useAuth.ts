// hooks/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { axios } from "@/lib/axios";
import { setCredentials, logout, setUser } from "@/store/slices/auth/authSlice";
import {
  closeAuthModal,
  setLoading,
  switchToLogin,
} from "@/store/slices/auth/authModalSlice";
import storage from "@/lib/storage";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/store/redux";

// Tipos según la API
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  access_token: string;

  message: string;
  statusCode: number;
}

interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  statusCode: number;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  statusCode: number;
}

// Auth API functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await axios.post("/v1/user/login", credentials);
    return data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await axios.post("/v1/user/register", userData);
    return data;
  },

  getMe: async (): Promise<UserResponse> => {
    const { data } = await axios.get("/v1/user/me");
    return data;
  },
};

// Hook para login
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (response) => {
      storage.setToken(response?.access_token);

      try {
        const userResponse = await authApi.getMe();
        dispatch(
          setCredentials({
            user: userResponse,
            access_token: response?.access_token,
          })
        );

        queryClient.invalidateQueries({ queryKey: ["user"] });
        dispatch(closeAuthModal());
        toast.success("¡Bienvenido de vuelta!");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al obtener datos del usuario");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

// Hook para register
export const useRegister = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      toast.success(
        "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión."
      );
      dispatch(switchToLogin());
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      const message =
        error.response?.data?.message || "Error al crear la cuenta";
      toast.error(message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

// Hook para obtener usuario
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    enabled: !!storage.getToken(),
    retry: false,
  });
};

// Hook personalizado para manejar side effects del usuario
export const useUserSideEffects = () => {
  const dispatch = useAppDispatch();
  const { data, error, isSuccess, isError } = useGetUser();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError && error) {
      console.error("Get user error:", error);
      if ((error as any).response?.status === 401) {
        dispatch(logout());
      }
    }
  }, [isError, error, dispatch]);

  return { data, error, isSuccess, isError };
};

// Hook para logout
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    dispatch(logout());
    storage.clearToken();
    queryClient.clear();
    toast.success("Sesión cerrada exitosamente");
  };
};
