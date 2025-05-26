import { useRoutes } from "react-router-dom";
import { allRoutes } from "./allRoutes";

export function AppRoutes() {
  const commonRoutes = [{ path: "/example", element: <h1>Inicio</h1> }];

  const routes = allRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);
  return <>{element}</>;
}