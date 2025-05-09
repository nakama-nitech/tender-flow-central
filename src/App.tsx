
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import SupplierLayout from './layouts/SupplierLayout';

// Auth and Protection
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RedirectHandler } from './components/auth/RedirectHandler';

// Pages
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import RoleSelector from './pages/RoleSelector';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTenderList from './pages/admin/AdminTenderList';
import AdminTenderCreate from './pages/admin/AdminTenderCreate';
import AdminTenderDetails from './pages/admin/AdminTenderDetails';
import AdminTenderBids from './pages/admin/AdminTenderBids';
import AdminSupplierList from './pages/admin/AdminSupplierList';
import AdminSupplierDetails from './pages/admin/AdminSupplierDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Supplier Pages
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import TenderDiscovery from './pages/supplier/TenderDiscovery';
import TenderDetails from './pages/supplier/TenderDetails';
import BidPreparation from './pages/supplier/BidPreparation';
import BidsList from './pages/supplier/BidsList';
import BidStatus from './pages/supplier/BidStatus';
import Cart from './pages/supplier/Cart';

// Company Profile
import CompanyProfileForm from './components/supplier/CompanyProfileForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/role" element={<RoleSelector />} />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="tenders" element={<AdminTenderList />} />
          <Route path="create-tender" element={<AdminTenderCreate />} />
          <Route path="tender/:tenderId" element={<AdminTenderDetails />} />
          <Route path="tender/:tenderId/bids" element={<AdminTenderBids />} />
          <Route path="suppliers" element={<AdminSupplierList />} />
          <Route path="supplier/:supplierId" element={<AdminSupplierDetails />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        <Route path="/supplier" element={
          <ProtectedRoute requiredRole="supplier">
            <SupplierLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RedirectHandler />} />
          <Route path="dashboard" element={<SupplierDashboard />} />
          <Route path="tenders" element={<TenderDiscovery />} />
          <Route path="tender-details/:tenderId" element={<TenderDetails />} />
          <Route path="prepare-bid/:tenderId" element={<BidPreparation />} />
          <Route path="my-bids" element={<BidsList />} />
          <Route path="bid/:bidId" element={<BidStatus />} />
          <Route path="cart" element={<Cart />} />
          <Route path="company-profile" element={<CompanyProfileForm />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <SonnerToaster position="top-right" />
      <Toaster />
    </Router>
  );
}

export default App;
