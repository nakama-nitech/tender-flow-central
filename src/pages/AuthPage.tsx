import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { LoginForm } from '@/components/auth/LoginForm';
import { MultiStepRegistrationForm } from '@/components/auth/MultiStepRegistrationForm';
import { CompanyType, Category, CountryLocations } from '@/components/auth/RegisterFormTypes';

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const navigate = useNavigate();
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  const countryLocations: CountryLocations = {
    'Kenya': [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Kakamega', 'Kisii', 
      'Garissa', 'Embu', 'Machakos', 'Meru', 'Thika', 'Kitale', 'Bungoma', 'Malindi'
    ],
    'Uganda': [
      'Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Bwizibwera', 'Mbale', 'Mukono',
      'Kasese', 'Masaka', 'Entebbe', 'Arua', 'Fort Portal', 'Kabale', 'Hoima', 'Mityana'
    ],
    'Tanzania': [
      'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kigoma',
      'Zanzibar', 'Moshi', 'Tabora', 'Iringa', 'Sumbawanga', 'Shinyanga', 'Musoma', 'Bukoba'
    ],
    'Rwanda': [
      'Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba', 'Cyangugu', 'Kibuye',
      'Kibungo', 'Nyanza', 'Ruhango', 'Karongi', 'Musanze', 'Muhanga', 'Huye', 'Nyagatare'
    ],
    'Ethiopia': [
      'Addis Ababa', 'Dire Dawa', 'Mek\'ele', 'Gondar', 'Adama', 'Hawassa', 'Bahir Dar', 'Jimma',
      'Dessie', 'Jijiga', 'Shashamane', 'Bishoftu', 'Sodo', 'Arba Minch', 'Hosaena', 'Harar'
    ]
  };
  
  // Set available locations based on selected country
  useEffect(() => {
    // Default country is Kenya from the initial state in useRegisterForm
    setAvailableLocations(countryLocations['Kenya'] || []);
  }, []);

  useEffect(() => {
    const fetchReferenceData = async () => {
      // Fetch company types
      const { data: companyTypesData, error: companyTypesError } = await supabase
        .from('company_types')
        .select('id, name') as { 
          data: CompanyType[] | null; 
          error: any 
        };
        
      if (companyTypesError) {
        console.error('Error fetching company types:', companyTypesError);
      } else {
        setCompanyTypes(companyTypesData || []);
      }
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name') as { 
          data: Category[] | null; 
          error: any 
        };
        
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
    };
    
    fetchReferenceData();
  }, []);

  const defaultCompanyTypes = [
    { id: 1, name: 'Sole Proprietor' },
    { id: 2, name: 'Limited Company' },
    { id: 3, name: 'Partnership' }
  ];

  const defaultCategories = [
    { id: 1, name: 'Construction & Building' },
    { id: 2, name: 'Medical Supplies' },
    { id: 3, name: 'IT & Technology' },
    { id: 4, name: 'Office Supplies' },
    { id: 5, name: 'Food & Catering' },
    { id: 6, name: 'Transportation' },
    { id: 7, name: 'Security Services' },
    { id: 8, name: 'Cleaning Services' },
    { id: 9, name: 'Consultancy Services' }
  ];

  const displayCompanyTypes = companyTypes.length > 0 ? companyTypes : defaultCompanyTypes;
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const handleTabChange = (value: string) => {
    setSearchParams(params => {
      const newParams = new URLSearchParams(params);
      newParams.set('tab', value);
      return newParams;
    });
  };

  console.log('[AuthPage] Rendering with tab:', defaultTab);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-100">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b bg-white shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
        <div className="w-full max-w-3xl">
          <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600/90 to-blue-500/90 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Welcome to Supplier Pro Africa</CardTitle>
              <CardDescription className="text-white/90">
                Your platform for discovering and bidding on tenders
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue={defaultTab} className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-2 mb-4 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register">
                <CardContent>
                  <MultiStepRegistrationForm 
                    companyTypes={displayCompanyTypes}
                    categories={displayCategories}
                    availableLocations={availableLocations}
                    countryLocations={countryLocations}
                  />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
