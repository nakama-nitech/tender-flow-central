import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

const ADMIN_EMAILS = ['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com'];

export const useRoleManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminEmail = useCallback((email: string) => {
    return ADMIN_EMAILS.includes(email);
  }, []);

  const getRoleFromUserMetadata = useCallback((user: any): UserRole | null => {
    if (user?.email && isAdminEmail(user.email)) {
      return 'admin';
    }
    
    // Check user_metadata first
    const metadataRole = user?.user_metadata?.role;
    if (metadataRole) {
      return metadataRole as UserRole;
    }
    
    return 'supplier'; // Default role
  }, [isAdminEmail]);

  const ensureUserProfile = useCallback(async (userId: string, email: string): Promise<UserRole> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user should be admin by email
      const shouldBeAdmin = isAdminEmail(email);

      // Get current role using RPC function
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: userId });

      if (roleError) {
        console.error("Error fetching user role:", roleError);
        throw roleError;
      }

      // Determine the final role
      const finalRole = shouldBeAdmin ? 'admin' : (roleData as UserRole || 'supplier');

      // Update user metadata if needed
      if (shouldBeAdmin) {
        await supabase.auth.updateUser({
          data: { role: 'admin' }
        });
      }

      // Ensure profile exists with correct role
      const { error: upsertError } = await supabase.rpc('upsert_profile', {
        user_id: userId,
        user_role: finalRole,
        first_name: '',
        last_name: ''
      });

      if (upsertError) {
        console.error("Error ensuring profile exists:", upsertError);
        throw upsertError;
      }

      return finalRole;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to manage user role";
      setError(errorMessage);
      toast({
        title: "Role Management Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminEmail, toast]);

  return {
    isLoading,
    error,
    isAdminEmail,
    getRoleFromUserMetadata,
    ensureUserProfile
  };
}; 