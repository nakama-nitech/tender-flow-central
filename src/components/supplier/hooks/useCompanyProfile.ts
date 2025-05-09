
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CompanyProfile {
  id: string;
  company_name: string;
  company_type_id: number | null;
  kra_pin: string | null;
  country: string;
  location: string;
  physical_address: string | null;
  website_url: string | null;
  phone_number: string;
  isComplete: boolean;
}

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const fetchProfile = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Check if the profile is complete (has required fields)
        const isComplete = !!(
          data.company_name && 
          data.phone_number && 
          data.country &&
          data.location
        );
        
        setProfile({
          ...data,
          isComplete
        } as CompanyProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load company profile");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, [user]);
  
  return { profile, isLoading, error, refetch: fetchProfile };
};
