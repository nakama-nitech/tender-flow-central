
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Index />} />
          
          {/* Supplier Routes */}
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/tenders" element={<TenderDiscovery />} />
          <Route path="/supplier/tender-details/:tenderId" element={<TenderDetails />} />
          <Route path="/supplier/prepare-bid/:tenderId" element={<BidPreparation />} />
          <Route path="/supplier/bid-status/:bidId" element={<BidStatus />} />
          <Route path="/supplier/my-bids" element={<BidsList />} />
          
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
