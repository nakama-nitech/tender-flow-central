
import { useState, useEffect } from 'react';
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
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
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
      setInitialLoadDone(true);
    } catch (error: any) {
      console.error('Error loading tender:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tender details: ' + (error.message || 'Unknown error'),
        variant: 'destructive'
      });
      setInitialLoadDone(true);
    }
  };

  // If tenderId is provided, load the tender data
  useEffect(() => {
    if (tenderId) {
      loadTender(tenderId);
    } else {
      setInitialLoadDone(true);
    }
  }, [tenderId]);

  const onSubmit = async (data: TenderFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }

      const userId = sessionData.session.user.id;

      // Convert date to ISO string for database
      const tenderData = {
        created_by: userId,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        deadline: data.deadline.toISOString(),
        status: data.status
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
      
      // Improved error message
      let errorMessage = 'Failed to save tender';
      if (error.message) {
        if (error.message.includes('row-level security policy')) {
          errorMessage = 'Permission denied: You do not have permission to create or update this tender. Please ensure you are logged in as an admin.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    initialLoadDone,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
