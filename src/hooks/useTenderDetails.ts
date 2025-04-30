
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tender, TenderStatus } from '@/types/tender';

export const useTenderDetails = (tenderId: string) => {
  const [tender, setTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTenderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!tenderId) {
        throw new Error("Tender ID is required");
      }
      
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', tenderId)
        .single();
      
      if (error) throw error;
      
      setTender(data as Tender);
    } catch (err) {
      console.error('Error fetching tender details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tender details');
      toast({
        title: 'Error',
        description: 'Failed to fetch tender details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTenderStatus = async (status: TenderStatus) => {
    try {
      const { error } = await supabase
        .from('tenders')
        .update({ status })
        .eq('id', tenderId);
      
      if (error) throw error;
      
      // Update the local tender object
      setTender(prev => prev ? { ...prev, status } : null);
      
      toast({
        title: 'Success',
        description: `Tender status updated to ${status}`,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating tender status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update tender status',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  useEffect(() => {
    fetchTenderDetails();
  }, [tenderId]);
  
  return {
    tender,
    isLoading,
    error,
    updateTenderStatus,
    refreshTender: fetchTenderDetails,
  };
};
