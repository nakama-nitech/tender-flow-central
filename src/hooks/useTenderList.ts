import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tender, TenderCategory, TenderStatus } from '@/types/tender';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type TenderInsert = Database['public']['Tables']['tenders']['Insert'];
type TenderUpdate = Database['public']['Tables']['tenders']['Update'];

export const useTenderList = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTenders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTenders(data || []);
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tenders');
      toast({
        title: 'Error',
        description: 'Failed to fetch tenders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTender = async (tender: TenderInsert) => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .insert(tender)
        .select()
        .single();

      if (error) throw error;

      setTenders((prev) => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Tender created successfully',
      });
      return data;
    } catch (err) {
      console.error('Error creating tender:', err);
      toast({
        title: 'Error',
        description: 'Failed to create tender',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTender = async (id: string, updates: TenderUpdate) => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTenders((prev) =>
        prev.map((tender) => (tender.id === id ? data : tender))
      );
      toast({
        title: 'Success',
        description: 'Tender updated successfully',
      });
      return data;
    } catch (err) {
      console.error('Error updating tender:', err);
      toast({
        title: 'Error',
        description: 'Failed to update tender',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteTender = async (id: string) => {
    try {
      const { error } = await supabase.from('tenders').delete().eq('id', id);

      if (error) throw error;

      setTenders((prev) => prev.filter((tender) => tender.id !== id));
      toast({
        title: 'Success',
        description: 'Tender deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting tender:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete tender',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  return {
    tenders,
    isLoading,
    error,
    createTender,
    updateTender,
    deleteTender,
    refreshTenders: fetchTenders,
  };
}; 