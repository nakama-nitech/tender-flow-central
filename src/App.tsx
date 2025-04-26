
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { RedirectHandler } from "./components/auth/RedirectHandler";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import TenderDiscovery from "./pages/supplier/TenderDiscovery";
import TenderDetails from "./pages/supplier/TenderDetails";
import BidPreparation from "./pages/supplier/BidPreparation";
import BidStatus from "./pages/supplier/BidStatus";
import BidsList from "./pages/supplier/BidsList";
import SupplierLayout from "./layouts/SupplierLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminTenderCreate from "./pages/admin/AdminTenderCreate";
import AdminTenderList from "./pages/admin/AdminTenderList";
import AdminTenderBids from "./pages/admin/AdminTenderBids";
import AdminSupplierList from "./pages/admin/AdminSupplierList";
import AdminSupplierDetails from "./pages/admin/AdminSupplierDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Increased from 2 to 3 for better reliability
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
          
          {/* Redirect Handler */}
          <Route path="/redirect" element={<RedirectHandler />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminTenderList />} />
            <Route path="tenders" element={<AdminTenderList />} />
            <Route path="create-tender" element={<AdminTenderCreate />} />
            <Route path="edit-tender/:tenderId" element={<AdminTenderCreate />} />
            <Route path="tender-bids/:tenderId" element={<AdminTenderBids />} />
            <Route path="suppliers" element={<AdminSupplierList />} />
            <Route path="suppliers/:supplierId" element={<AdminSupplierDetails />} />
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
          
          {/* Replace /select-role with /redirect */}
          <Route path="/select-role" element={<Navigate to="/redirect" replace />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
