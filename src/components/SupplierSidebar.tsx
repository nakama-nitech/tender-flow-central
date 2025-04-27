
import React from 'react';
import { Home, FileText, Send, Clock, Bell, Settings, Menu, X, FileSearch, LogOut, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SupplierSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const SupplierSidebar: React.FC<SupplierSidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  activePage, 
  setActivePage 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, handleSignOut, isAdmin } = useAuth('supplier');
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/supplier/dashboard' },
    { id: 'tenders', name: 'Discover Tenders', icon: FileSearch, path: '/supplier/tenders' },
    { id: 'my-bids', name: 'My Bids', icon: Send, path: '/supplier/my-bids' },
    { id: 'cart', name: 'Cart', icon: ShoppingCart, path: '/supplier/cart' },
    { id: 'bid-status', name: 'Bid Status', icon: Clock, path: '/supplier/bid-status' },
    { id: 'notifications', name: 'Notifications', icon: Bell, path: '/supplier/notifications' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/supplier/settings' }
  ];

  const onLogout = async () => {
    try {
      await handleSignOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Function to switch to admin dashboard if user has admin privileges
  const switchToAdmin = () => {
    navigate('/admin');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white z-30 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
          <h1 className={cn("font-bold text-xl", !isOpen && "md:hidden")}>SupplierPro Africa</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-white hover:bg-blue-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-blue-800 hover:text-white",
                    activePage === item.id && "bg-blue-800 text-white"
                  )}
                  onClick={() => {
                    setActivePage(item.id);
                    navigate(item.path);
                  }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  <span className={cn(!isOpen && "md:hidden")}>
                    {item.name}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <div className={cn("flex items-center mb-4", !isOpen && "md:hidden")}>
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>
          </div>
          
          {/* Add admin dashboard switch button if the user is an admin */}
          {isAdmin && (
            <Button 
              variant="secondary" 
              className="w-full justify-start mb-2 bg-amber-600 text-white hover:bg-amber-700" 
              onClick={switchToAdmin}
            >
              <Home className="mr-2 h-4 w-4" />
              <span className={cn(!isOpen && "md:hidden")}>Admin Dashboard</span>
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            className="w-full justify-start bg-blue-700 text-white hover:bg-blue-800" 
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className={cn(!isOpen && "md:hidden")}>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SupplierSidebar;
