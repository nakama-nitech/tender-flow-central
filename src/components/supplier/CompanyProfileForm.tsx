
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, ArrowLeft, Save, BuildingIcon, Globe, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Company types
const companyTypes = [
  { id: 1, name: 'Limited Company' },
  { id: 2, name: 'Partnership' },
  { id: 3, name: 'Sole Proprietorship' },
  { id: 4, name: 'Corporation' },
  { id: 5, name: 'Non-Profit Organization' }
];

// Countries
const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'];

interface CompanyProfileFormProps {
  onCompleted?: () => void;
  redirectAfterSave?: boolean;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  onCompleted,
  redirectAfterSave = true
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    registrationNumber: '',
    country: '',
    city: '',
    physicalAddress: '',
    postalAddress: '',
    phoneNumber: '',
    websiteUrl: '',
    description: '',
    yearEstablished: new Date().getFullYear().toString()
  });

  // Check if profile already exists
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching supplier profile:", error);
          return;
        }
        
        if (data) {
          // Populate form with existing data
          setFormData({
            companyName: data.company_name || '',
            companyType: data.company_type_id?.toString() || '',
            registrationNumber: data.kra_pin || '',
            country: data.country || '',
            city: data.location || '',
            physicalAddress: data.physical_address || '',
            postalAddress: data.postal_address || '',
            phoneNumber: data.phone_number || '',
            websiteUrl: data.website_url || '',
            description: data.description || '',
            yearEstablished: data.year_established?.toString() || new Date().getFullYear().toString()
          });
          
          // If profile is complete, mark it as completed
          if (data.company_name && data.phone_number && data.country) {
            setIsCompleted(true);
          }
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    };
    
    checkProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your company profile",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('suppliers')
        .upsert({
          id: user.id,
          company_name: formData.companyName,
          company_type_id: formData.companyType ? parseInt(formData.companyType) : null,
          kra_pin: formData.registrationNumber,
          country: formData.country,
          location: formData.city,
          physical_address: formData.physicalAddress,
          postal_address: formData.postalAddress,
          phone_number: formData.phoneNumber,
          website_url: formData.websiteUrl,
          description: formData.description,
          year_established: formData.yearEstablished ? parseInt(formData.yearEstablished) : null
        });
        
      if (error) throw error;
      
      toast({
        title: "Profile Saved",
        description: "Your company profile has been updated successfully",
      });
      
      setIsCompleted(true);
      
      if (onCompleted) {
        onCompleted();
      }
      
      if (redirectAfterSave) {
        // Redirect after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate('/supplier/dashboard');
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">
            Complete your company profile to participate in tenders
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/supplier/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      {isCompleted && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium">Profile Complete</p>
            <p className="text-sm">Your company profile is complete. You can now participate in tenders.</p>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuildingIcon className="h-5 w-5 text-primary" />
            Company Information
          </CardTitle>
          <CardDescription>
            Provide details about your company that will be visible to tender creators
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <Select
                  value={formData.companyType}
                  onValueChange={(value) => handleSelectChange('companyType', value)}
                >
                  <SelectTrigger id="companyType">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration/KRA PIN</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number or KRA PIN"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established</Label>
                <Input
                  id="yearEstablished"
                  name="yearEstablished"
                  type="number"
                  value={formData.yearEstablished}
                  onChange={handleChange}
                  placeholder="Enter year established"
                  min="1900"
                  max={new Date().getFullYear().toString()}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange('country', value)}
                    required
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City/Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city or location"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalAddress">Physical Address</Label>
                  <Textarea
                    id="physicalAddress"
                    name="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={handleChange}
                    placeholder="Enter physical address"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalAddress">Postal Address</Label>
                  <Input
                    id="postalAddress"
                    name="postalAddress"
                    value={formData.postalAddress}
                    onChange={handleChange}
                    placeholder="Enter postal address"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="rounded-l-none"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your company, services, and expertise"
                rows={4}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyProfileForm;
