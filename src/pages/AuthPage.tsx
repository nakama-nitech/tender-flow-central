
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegistrationForm } from '../components/auth/RegistrationForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('tab') || 'login'
  );
  
  const companyTypes = [
    { id: 1, name: 'Limited Company' },
    { id: 2, name: 'Partnership' },
    { id: 3, name: 'Sole Proprietorship' },
    { id: 4, name: 'NGO / Non-Profit' },
    { id: 5, name: 'Government Entity' }
  ];
  
  const categories = [
    { id: 1, name: 'Construction & Engineering' },
    { id: 2, name: 'IT & Technology' },
    { id: 3, name: 'Office Supplies & Equipment' },
    { id: 4, name: 'Medical Supplies' },
    { id: 5, name: 'Logistics & Transportation' },
    { id: 6, name: 'Food & Catering' },
    { id: 7, name: 'Security Services' },
    { id: 8, name: 'Cleaning & Maintenance' },
    { id: 9, name: 'Professional Services' },
    { id: 10, name: 'Energy & Utilities' }
  ];
  
  const availableLocations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Malindi', 'Kitale', 'Garissa', 'Thika', 'Nyeri'
  ];
  
  const countryLocations = {
    Kenya: [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
      'Malindi', 'Kitale', 'Garissa', 'Thika', 'Nyeri'
    ],
    Uganda: [
      'Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara'
    ],
    Tanzania: [
      'Dar es Salaam', 'Zanzibar', 'Arusha', 'Mwanza', 'Dodoma'
    ]
  };

  // Redirect based on user role
  useEffect(() => {
    if (user && !isLoading) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/supplier/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, navigate, isAdmin]);

  // Update the active tab when search params change
  useEffect(() => {
    const tabFromParams = searchParams.get('tab');
    if (tabFromParams && (tabFromParams === 'login' || tabFromParams === 'register')) {
      setActiveTab(tabFromParams);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="py-6 px-4 md:px-6 bg-white/20 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            <span className="bg-primary text-white p-1 rounded mr-2">SP</span>
            SupplierPro Africa
          </h1>
          <div className="flex space-x-4">
            <a href="/" className="text-primary hover:underline">Home</a>
            <a href="#" className="text-primary hover:underline">About Us</a>
            <a href="#" className="text-primary hover:underline">Contact</a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95 animate-fade-in">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Welcome to SupplierPro</CardTitle>
              <CardDescription>Connect with procurement teams across Africa</CardDescription>
            </CardHeader>
            
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full mb-2">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary/90 data-[state=active]:text-white">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary/90 data-[state=active]:text-white">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="animate-fade-in">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register" className="animate-fade-in">
                <RegistrationForm 
                  companyTypes={companyTypes}
                  categories={categories}
                  availableLocations={availableLocations}
                  countryLocations={countryLocations}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <footer className="py-4 px-4 md:px-6 text-center bg-white/20 backdrop-blur-sm">
        <div className="container mx-auto text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SupplierPro Africa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
