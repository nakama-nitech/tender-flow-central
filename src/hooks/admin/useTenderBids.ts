
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bid } from '@/types/tender';

export const useTenderBids = (tenderId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBids = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('tenderId', tenderId);
        
      if (error) {
        throw error;
      }
      
      setBids(data || []);
    } catch (err: any) {
      console.error('Error fetching bids:', err);
      setError(err.message || 'Failed to load bids');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateBidStatus = async (bidId: string, status: Bid['status']) => {
    try {
      const { error } = await supabase
        .from('bids')
        .update({ status })
        .eq('id', bidId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setBids(prevBids => 
        prevBids.map(bid => 
          bid.id === bidId ? { ...bid, status } : bid
        )
      );
      
      toast({
        title: 'Bid Updated',
        description: `Bid status has been changed to ${status}.`,
      });
      
      // If we're awarding this bid, update other bids to rejected
      if (status === 'awarded') {
        // First update local state
        setBids(prevBids => 
          prevBids.map(bid => 
            bid.id !== bidId && bid.status === 'awarded' 
              ? { ...bid, status: 'rejected' as Bid['status'] } 
              : bid
          )
        );
        
        // Then update in database
        const { error: updateError } = await supabase
          .from('bids')
          .update({ status: 'rejected' })
          .eq('tenderId', tenderId)
          .neq('id', bidId)
          .eq('status', 'awarded');
        
        if (updateError) {
          console.error('Error updating other bids:', updateError);
        }
        
        // Also update the tender status
        const { error: tenderError } = await supabase
          .from('tenders')
          .update({ status: 'awarded' })
          .eq('id', tenderId);
          
        if (tenderError) {
          console.error('Error updating tender status:', tenderError);
        }
      }
      
      return true;
    } catch (err: any) {
      console.error('Error updating bid:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update bid',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Load bids when component mounts
  useEffect(() => {
    fetchBids();
  }, [tenderId]);
  
  return {
    bids,
    isLoading,
    error,
    refreshBids: fetchBids,
    updateBidStatus
  };
};
