
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import TenderDiscovery from "./pages/supplier/TenderDiscovery";
import TenderDetails from "./pages/supplier/TenderDetails";
import BidPreparation from "./pages/supplier/BidPreparation";
import BidStatus from "./pages/supplier/BidStatus";
import BidsList from "./pages/supplier/BidsList";
import SupplierLayout from "./layouts/SupplierLayout";
import AdminLayout from "./layouts/AdminLayout";
import RoleSelector from "./pages/RoleSelector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Role Selection Route */}
          <Route path="/select-role" element={<RoleSelector />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Index />} />
          </Route>
          
          {/* Supplier Routes */}
          <Route path="/supplier" element={<SupplierLayout />}>
            <Route path="dashboard" element={<SupplierDashboard />} />
            <Route path="tenders" element={<TenderDiscovery />} />
            <Route path="tender-details/:tenderId" element={<TenderDetails />} />
            <Route path="prepare-bid/:tenderId" element={<BidPreparation />} />
            <Route path="bid-status/:bidId" element={<BidStatus />} />
            <Route path="my-bids" element={<BidsList />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/admin/*" element={<Navigate to="/admin" />} />
          <Route path="/supplier" element={<Navigate to="/supplier/dashboard" />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
