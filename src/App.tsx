import { AppRoutes } from "@/routes";
import { AppProvider } from "@/provider/AppProvider";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
