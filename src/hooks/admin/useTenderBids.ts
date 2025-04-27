
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bid, Tender } from '@/types/tender';

export const useTenderBids = (tenderId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [tender, setTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTender = async () => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', tenderId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        setError("Tender not found");
        return;
      }
      
      // Map database fields to our interface
      const formattedTender: Tender = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        deadline: data.deadline,
        status: data.status,
        createdAt: data.created_at,
        created_by: data.created_by
      };
      
      setTender(formattedTender);
    } catch (err: any) {
      console.error('Error fetching tender:', err);
      setError(err.message || 'Failed to load tender');
    }
  };

  const fetchBids = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First fetch the tender
      await fetchTender();
      
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('tenderid', tenderId);
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        setBids([]);
        return;
      }
      
      // Map database fields to our interface
      const formattedBids: Bid[] = data.map(bid => ({
        id: bid.id,
        tenderId: bid.tenderid,
        tenderid: bid.tenderid, // Support both formats
        vendorName: bid.vendorname,
        vendorname: bid.vendorname, // Support both formats
        vendorEmail: bid.vendoremail,
        vendoremail: bid.vendoremail, // Support both formats
        amount: bid.amount,
        proposal: bid.proposal,
        submittedDate: bid.submitteddate,
        submitteddate: bid.submitteddate, // Support both formats
        status: bid.status as Bid['status'],
        score: bid.score,
        notes: bid.notes,
        vendor_id: bid.vendor_id,
        created_at: bid.created_at,
        updated_at: bid.updated_at
      }));
      
      setBids(formattedBids);
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
          .eq('tenderid', tenderId)
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
    tender, // Now returning the tender data
    isLoading,
    error,
    refreshBids: fetchBids,
    updateBidStatus
  };
};
