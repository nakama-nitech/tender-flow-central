import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building, Globe, MapPin, Phone, Mail, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';

interface SupplierDetails {
  id: string;
  company_name: string;
  company_type_id: number | null;
  country: string;
  created_at: string;
  kra_pin: string | null;
  location: string;
  phone_number: string;
  physical_address: string | null;
  updated_at: string;
  verified: boolean;
  website_url: string | null;
}

const AdminSupplierDetails = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  const [isVerified, setIsVerified] = useState(false);
  
  const { data: supplier, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: async () => {
      if (!supplierId) throw new Error('Supplier ID is required');
      
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();
      
      if (error) {
        console.error('Error fetching supplier details:', error);
        throw error;
      }
      
      setIsVerified(data.verified);
      return data as SupplierDetails;
    },
    enabled: !!supplierId && !!isAdmin()
  });

  const handleVerificationChange = async (verified: boolean) => {
    try {
      if (!supplierId) return;
      
      const { error } = await supabase
        .from('suppliers')
        .update({ verified })
        .eq('id', supplierId);
        
      if (error) throw error;
      
      setIsVerified(verified);
      toast({
        title: verified ? 'Supplier verified' : 'Supplier unverified',
        description: `Supplier has been ${verified ? 'verified' : 'unverified'} successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Operation failed',
        description: err.message || 'Failed to update supplier verification status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Supplier</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'Failed to load supplier details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/admin/suppliers')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
            </Button>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin/suppliers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{supplier.company_name}</h2>
            <p className="text-muted-foreground">Supplier details and verification</p>
          </div>
        </div>
        
        <Badge variant={isVerified ? "outline" : "secondary"} className={`text-sm px-3 py-1 ${isVerified ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}>
          {isVerified ? 'Verified' : 'Pending Verification'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Details about the supplier's company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Company Name</p>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-primary" />
                  <p className="font-medium">{supplier.company_name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">KRA PIN</p>
                <p className="font-medium">{supplier.kra_pin || 'Not provided'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Website</p>
                {supplier.website_url ? (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a 
                      href={supplier.website_url.startsWith('http') ? supplier.website_url : `https://${supplier.website_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {supplier.website_url}
                    </a>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not provided</p>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Registered On</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">
                    {new Date(supplier.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium">{supplier.location}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{supplier.country}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Physical Address</p>
                <p className="font-medium">{supplier.physical_address || 'Not provided'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <p className="font-medium">{supplier.phone_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Manage supplier verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="verify-supplier" className="flex flex-col space-y-1">
                <span>Verify Supplier</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Mark supplier as verified to allow full access
                </span>
              </Label>
              <Switch
                id="verify-supplier"
                checked={isVerified}
                onCheckedChange={handleVerificationChange}
              />
            </div>
            
            {!isVerified && (
              <div className="flex items-start space-x-2 p-3 bg-amber-50 text-amber-900 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-sm">
                  This supplier hasn't been verified yet. Verified suppliers have full access to bid on tenders.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-6">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Feature coming soon",
                  description: "The ability to remove suppliers will be available soon",
                });
              }}
            >
              Remove Supplier
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminSupplierDetails;
