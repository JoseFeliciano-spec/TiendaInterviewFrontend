import type { JSX } from "react";
import { BrowserRouter as Router } from "react-router-dom";

interface iAppProvider {
  children: JSX.Element;
}

export function AppProvider({ children }: iAppProvider) {
  return <Router>{children}</Router>;
}
