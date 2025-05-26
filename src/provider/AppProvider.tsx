import type { JSX } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { store } from "@/store";
import { AuthModal } from "@/components/Auth/AuthModal";
import { BrowserRouter as Router } from "react-router-dom";

interface iAppProvider {
  children: JSX.Element;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function AppProvider({ children }: iAppProvider) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>{children}</Router>

        {/* AuthModal global - se muestra/oculta según Redux state */}
        <AuthModal />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#00825A",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
}
