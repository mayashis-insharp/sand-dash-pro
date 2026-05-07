import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard.tsx";
import Orders from "./pages/Orders.tsx";
import Payments from "./pages/Payments.tsx";
import Inventory from "./pages/Inventory.tsx";
import Suppliers from "./pages/Suppliers.tsx";
import Expenses from "./pages/Expenses.tsx";
import Employees from "./pages/Employees.tsx";
import Customers from "./pages/Customers.tsx";
import Users from "./pages/Users.tsx";
import SettingsPage from "./pages/Settings.tsx";
import Login from "./pages/Login.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ThemeApplier } from "./components/ThemeApplier";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeApplier />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/inventories" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
