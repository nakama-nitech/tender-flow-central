
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Phone, Building, Briefcase, ShieldCheck, Eye, EyeOff, Flag, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type CompanyType = Database['public']['Tables']['company_types']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];

// County/Province data by country
interface CountryLocations {
  [key: string]: string[];
}

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyType: '',
    companyName: '',
    location: '',
    country: 'Kenya',
    contactName: '',
    phoneNumber: '',
    kraPin: '',
    physicalAddress: '',
    websiteUrl: '',
    categoriesOfInterest: [] as string[],
    supplyLocations: [] as string[],
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  
  // County/Province data by country
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
  
  useEffect(() => {
    // Set available locations based on selected country
    if (registerForm.country) {
      setAvailableLocations(countryLocations[registerForm.country] || []);
    }
  }, [registerForm.country]);
  
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
      
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('id, name') as { 
          data: Location[] | null; 
          error: any 
        };
        
      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
      } else {
        setLocations(locationsData || []);
      }
    };
    
    fetchReferenceData();
  }, []);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) throw error;
      
      // Check user role to decide where to redirect
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single() as { 
          data: Profile | null; 
          error: any 
        };
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back to TenderFlow",
      });
      
      // Redirect based on role
      if (profileData && profileData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/supplier/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (!registerForm.agreeToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "You must agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split the contact name into first and last name
      const nameParts = registerForm.contactName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // 1. Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            role: 'supplier',
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("User registration failed");
      
      // 2. Insert supplier data
      const { error: supplierError } = await supabase
        .from('suppliers')
        .insert({
          id: authData.user.id,
          company_type_id: parseInt(registerForm.companyType),
          company_name: registerForm.companyName,
          location: registerForm.location,
          country: registerForm.country,
          phone_number: registerForm.phoneNumber,
          kra_pin: registerForm.kraPin,
          physical_address: registerForm.physicalAddress,
          website_url: registerForm.websiteUrl,
        } as Supplier);
        
      if (supplierError) throw supplierError;
      
      // 3. Insert supplier categories
      if (registerForm.categoriesOfInterest.length > 0) {
        const supplierCategories = registerForm.categoriesOfInterest.map(categoryId => ({
          supplier_id: authData.user.id,
          category_id: parseInt(categoryId)
        }));
        
        const { error: categoriesError } = await supabase
          .from('supplier_categories')
          .insert(supplierCategories as any);
          
        if (categoriesError) throw categoriesError;
      }
      
      // 4. Insert supplier locations
      if (registerForm.supplyLocations.length > 0) {
        const supplierLocations = registerForm.supplyLocations.map(locationId => ({
          supplier_id: authData.user.id,
          location_id: parseInt(locationId)
        }));
        
        const { error: locationsError } = await supabase
          .from('supplier_locations')
          .insert(supplierLocations as any);
          
        if (locationsError) throw locationsError;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      
      // Switch to login tab
      setIsSubmitting(false);
      const searchParams = new URLSearchParams();
      searchParams.set('tab', 'login');
      navigate({ search: searchParams.toString() });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b bg-white shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
        <div className="w-full max-w-3xl">
          <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center bg-gradient-to-r from-primary/80 to-indigo-600/80 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Welcome to TenderFlow</CardTitle>
              <CardDescription className="text-white/90">
                Your platform for discovering and bidding on tenders
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="supplier@example.com" 
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          required
                          className="border-primary/20 focus:border-primary pr-10"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Logging in...
                        </>
                      ) : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit}>
                  <CardContent className="space-y-6">
                    <div className="text-lg font-medium flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <span>Company Details</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type <span className="text-red-500">*</span></Label>
                        <Select 
                          value={registerForm.companyType}
                          onValueChange={(value) => setRegisterForm({...registerForm, companyType: value})}
                          required
                        >
                          <SelectTrigger className="border-primary/20">
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            {displayCompanyTypes.map(type => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter email address" 
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            required
                            className="border-primary/20 pr-10"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                            required
                            className="border-primary/20 pr-10"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="companyName"
                          placeholder="Enter company name"
                          value={registerForm.companyName}
                          onChange={(e) => setRegisterForm({...registerForm, companyName: e.target.value})}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <Input 
                          id="location"
                          placeholder="Enter location"
                          value={registerForm.location}
                          onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                        <Select 
                          value={registerForm.country}
                          onValueChange={(value) => setRegisterForm({...registerForm, country: value, supplyLocations: []})}
                          required
                        >
                          <SelectTrigger className="border-primary/20">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="Uganda">Uganda</SelectItem>
                            <SelectItem value="Tanzania">Tanzania</SelectItem>
                            <SelectItem value="Rwanda">Rwanda</SelectItem>
                            <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="contactName"
                          placeholder="First & Last Name"
                          value={registerForm.contactName}
                          onChange={(e) => setRegisterForm({...registerForm, contactName: e.target.value})}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="ml-2 text-sm text-muted-foreground">+254</span>
                          </div>
                          <Input 
                            id="phoneNumber"
                            className="rounded-l-none border-primary/20"
                            placeholder="7XX XXX XXX"
                            value={registerForm.phoneNumber}
                            onChange={(e) => setRegisterForm({...registerForm, phoneNumber: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="kraPin">KRA PIN Number <span className="text-red-500">*</span></Label>
                        <Input 
                          id="kraPin"
                          placeholder="Enter Tax Identification Number"
                          value={registerForm.kraPin}
                          onChange={(e) => setRegisterForm({...registerForm, kraPin: e.target.value})}
                          required
                          className="border-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="physicalAddress">Physical Address</Label>
                        <Textarea 
                          id="physicalAddress"
                          placeholder="P.O. Box address"
                          value={registerForm.physicalAddress}
                          onChange={(e) => setRegisterForm({...registerForm, physicalAddress: e.target.value})}
                          className="border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website or Social Media URL</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                            <Globe className="h-4 w-4 text-primary" />
                          </div>
                          <Input 
                            id="websiteUrl"
                            className="rounded-l-none border-primary/20"
                            placeholder="http://www.example.com"
                            value={registerForm.websiteUrl}
                            onChange={(e) => setRegisterForm({...registerForm, websiteUrl: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoriesOfInterest" className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-primary" />
                        Categories of Interest <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={registerForm.categoriesOfInterest.join(',')}
                        onValueChange={(value) => {
                          const selectedCategories = value ? value.split(',') : [];
                          setRegisterForm({...registerForm, categoriesOfInterest: selectedCategories});
                        }}
                      >
                        <SelectTrigger className="border-primary/20">
                          <SelectValue placeholder="Select categories of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          {displayCategories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supplyLocations" className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Supply Locations in {registerForm.country}
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-md border-primary/20 max-h-[200px] overflow-y-auto">
                        {availableLocations.map((location, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${index}`}
                              checked={registerForm.supplyLocations.includes(location)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setRegisterForm({
                                    ...registerForm,
                                    supplyLocations: [...registerForm.supplyLocations, location]
                                  });
                                } else {
                                  setRegisterForm({
                                    ...registerForm,
                                    supplyLocations: registerForm.supplyLocations.filter(loc => loc !== location)
                                  });
                                }
                              }}
                              className="border-primary/40 data-[state=checked]:bg-primary"
                            />
                            <label
                              htmlFor={`location-${index}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={registerForm.agreeToTerms}
                          onCheckedChange={(checked) => 
                            setRegisterForm({...registerForm, agreeToTerms: checked as boolean})
                          }
                          className="border-primary/40 data-[state=checked]:bg-primary"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline mx-1">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary hover:underline mx-1">
                            Privacy Policy
                          </a>
                          <span className="text-red-500"> *</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Fields marked with <span className="text-red-500">*</span> are required
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm">You have an account?</span>
                        <Button variant="link" className="p-0 ml-1" type="button" onClick={() => {
                          const searchParams = new URLSearchParams();
                          searchParams.set('tab', 'login');
                          navigate({ search: searchParams.toString() });
                        }}>
                          Sign In
                        </Button>
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700">
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Creating account...
                          </>
                        ) : "Sign Up"}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
