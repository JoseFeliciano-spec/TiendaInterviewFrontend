/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { LayoutInside } from "@/components";
import { lazyImport } from "@/utils/lazyimport";

function App() {
  return (
    <LayoutInside>
      <Suspense fallback={<h1>Cargando....</h1>}>
        <Outlet />
      </Suspense>
    </LayoutInside>
  );
}

const { Home } = lazyImport(() => import("@/features/home"), "Home");

const { ProductsPage } = lazyImport(
  () => import("@/features/products"),
  "ProductsPage"
);

const { ProductPage } = lazyImport(
  () => import("@/features/products"),
  "ProductPage"
);

const { CheckoutPage } = lazyImport(
  () => import("@/features/checkout"),
  "CheckoutPage"
);

const { TransactionHistoryPage } = lazyImport(
  () => import("@/features/historial"),
  "TransactionHistoryPage"
);

export const allRoutes = [
  {
    path: "",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:id", element: <ProductPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/historial", element: <TransactionHistoryPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="" />,
  },
];
