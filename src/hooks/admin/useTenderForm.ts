
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TenderFormValues, tenderFormSchema } from '@/types/tenderForm';

export const useTenderForm = (tenderId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TenderFormValues>({
    resolver: zodResolver(tenderFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'goods',
      budget: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      status: 'draft'
    }
  });

  // Load tender data if editing
  const loadTender = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        form.reset({
          ...data,
          deadline: new Date(data.deadline),
          budget: Number(data.budget)
        });
      }
    } catch (error) {
      console.error('Error loading tender:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tender details',
        variant: 'destructive'
      });
    }
  };

  // If tenderId is provided, load the tender data
  if (tenderId) {
    loadTender(tenderId);
  }

  const onSubmit = async (data: TenderFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { user } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const tenderData = {
        ...data,
        created_by: user.id
      };

      let result;
      
      if (tenderId) {
        // Update existing tender
        result = await supabase
          .from('tenders')
          .update(tenderData)
          .eq('id', tenderId);
      } else {
        // Create new tender
        result = await supabase
          .from('tenders')
          .insert(tenderData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: tenderId ? 'Tender Updated' : 'Tender Created',
        description: tenderId 
          ? 'Your tender has been updated successfully.' 
          : 'Your tender has been created successfully.',
      });

      navigate('/admin/tenders');
    } catch (error: any) {
      console.error('Error saving tender:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save tender',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
