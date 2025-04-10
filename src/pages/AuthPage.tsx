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
import { ArrowLeft, CheckCircle, Globe, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [companyTypes, setCompanyTypes] = useState<{id: number, name: string}[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [locations, setLocations] = useState<{id: number, name: string}[]>([]);
  
  useEffect(() => {
    const fetchReferenceData = async () => {
      // Fetch company types
      const { data: companyTypesData, error: companyTypesError } = await supabase
        .from('company_types')
        .select('id, name');
        
      if (companyTypesError) {
        console.error('Error fetching company types:', companyTypesError);
      } else {
        setCompanyTypes(companyTypesData || []);
      }
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');
        
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
      
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('id, name');
        
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
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
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
        });
        
      if (supplierError) throw supplierError;
      
      // 3. Insert supplier categories
      if (registerForm.categoriesOfInterest.length > 0) {
        const supplierCategories = registerForm.categoriesOfInterest.map(categoryId => ({
          supplier_id: authData.user.id,
          category_id: parseInt(categoryId)
        }));
        
        const { error: categoriesError } = await supabase
          .from('supplier_categories')
          .insert(supplierCategories);
          
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
          .insert(supplierLocations);
          
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
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b bg-background">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to TenderFlow</CardTitle>
              <CardDescription>
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                    <div className="text-lg font-medium">Company Details</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type <span className="text-red-500">*</span></Label>
                        <Select 
                          value={registerForm.companyType}
                          onValueChange={(value) => setRegisterForm({...registerForm, companyType: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyTypes.map(type => (
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="companyName"
                          placeholder="Enter company name"
                          value={registerForm.companyName}
                          onChange={(e) => setRegisterForm({...registerForm, companyName: e.target.value})}
                          required
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                        <Select 
                          value={registerForm.country}
                          onValueChange={(value) => setRegisterForm({...registerForm, country: value})}
                          required
                        >
                          <SelectTrigger>
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">+254</span>
                          </div>
                          <Input 
                            id="phoneNumber"
                            className="rounded-l-none"
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
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website or Social Media URL</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input 
                            id="websiteUrl"
                            className="rounded-l-none"
                            placeholder="http://www.example.com"
                            value={registerForm.websiteUrl}
                            onChange={(e) => setRegisterForm({...registerForm, websiteUrl: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoriesOfInterest">Categories of Interest <span className="text-red-500">*</span></Label>
                      <Select
                        value={registerForm.categoriesOfInterest.join(',')}
                        onValueChange={(value) => {
                          const selectedCategories = value ? value.split(',') : [];
                          setRegisterForm({...registerForm, categoriesOfInterest: selectedCategories});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supplyLocations">Supply Locations</Label>
                      <Select
                        value={registerForm.supplyLocations.join(',')}
                        onValueChange={(value) => {
                          const selectedLocations = value ? value.split(',') : [];
                          setRegisterForm({...registerForm, supplyLocations: selectedLocations});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supply locations" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={registerForm.agreeToTerms}
                          onCheckedChange={(checked) => 
                            setRegisterForm({...registerForm, agreeToTerms: checked as boolean})
                          }
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary hover:underline">
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
                      <Button type="submit" disabled={isSubmitting}>
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
