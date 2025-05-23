
import React from 'react';
import { Home, FileText, Users, Settings, Menu, X, PlusCircle, Store, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  activePage, 
  setActivePage 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, handleSignOut, setUserRole } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'tenders', name: 'Manage Tenders', icon: FileText, path: '/admin/tenders' },
    { id: 'createTender', name: 'Create Tender', icon: PlusCircle, path: '/admin/create-tender' },
    { id: 'suppliers', name: 'Manage Suppliers', icon: Store, path: '/admin/suppliers' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/admin/settings' }
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

  // Function to switch to supplier dashboard
  const switchToSupplier = () => {
    setUserRole('supplier');
    navigate('/supplier/dashboard');
    toast({
      title: "Supplier Dashboard",
      description: "Switched to supplier dashboard view",
    });
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
          "fixed md:sticky top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white z-30 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <h1 className={cn("font-bold text-xl", !isOpen && "md:hidden")}>SupplierPro Africa</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-white hover:bg-gray-700"
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
                    "w-full justify-start text-white hover:bg-gray-700 hover:text-white",
                    activePage === item.id && "bg-gray-700 text-white"
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
        
        <div className="p-4 border-t border-gray-700">
          <div className={cn("flex items-center mb-4", !isOpen && "md:hidden")}>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
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

          {/* Add supplier dashboard switch button */}
          <Button 
            variant="secondary" 
            className="w-full justify-start mb-2 bg-blue-600 text-white hover:bg-blue-700" 
            onClick={switchToSupplier}
          >
            <Store className="mr-2 h-4 w-4" />
            <span className={cn(!isOpen && "md:hidden")}>Switch to Supplier</span>
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full justify-start bg-gray-600 text-white hover:bg-gray-700" 
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

export default Sidebar;
