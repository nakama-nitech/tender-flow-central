
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useRoleSelector = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error, user, userRole } = useAuth();
  const [updatingRole, setUpdatingRole] = useState(false);
  const [hasAdminPermission, setHasAdminPermission] = useState(false);
  
  // Check if user has admin permission from metadata or profile
  useEffect(() => {
    const checkAdminPermission = async () => {
      if (!user) return;
      
      try {
        // First check if user role is already admin
        if (userRole === 'admin') {
          console.log("Admin role found in profile");
          setHasAdminPermission(true);
          return;
        }
        
        // Check user metadata for admin role
        const { data: userData } = await supabase.auth.getUser();
        const metadataRole = userData?.user?.user_metadata?.role;
        
        if (metadataRole === 'admin') {
          console.log("Admin role found in metadata");
          setHasAdminPermission(true);
          return;
        }
        
        // Check if user is in the list of admin emails
        const adminEmails = ['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com'];
        if (user.email && adminEmails.includes(user.email)) {
          console.log("User email is in admin list");
          setHasAdminPermission(true);
          return;
        }
      } catch (error) {
        console.error("Error checking admin permission:", error);
      }
    };
    
    checkAdminPermission();
  }, [user, userRole]);
  
  useEffect(() => {
    // Check if we have a user session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("No active session, redirecting to auth");
        navigate('/auth');
      }
    };
    
    if (!isLoading && !user) {
      console.log("No user found after loading, checking session");
      checkSession();
    }
    
    // If we have a role but no error, auto-navigate
    if (!isLoading && !error && userRole && !updatingRole) {
      console.log("Auto-navigating based on role:", userRole);
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'supplier') {
        navigate('/supplier/dashboard');
      }
    }
  }, [isLoading, user, userRole, error, navigate, updatingRole]);

  const selectRole = async (role: 'admin' | 'supplier') => {
    try {
      setUpdatingRole(true);
      
      // If user already has the role, simply navigate
      if (role === userRole) {
        console.log(`User already has role ${role}, navigating directly`);
        navigate(role === 'admin' ? '/admin' : '/supplier/dashboard');
        setUpdatingRole(false);
        return;
      }

      // Check if the user has admin permission when selecting admin role
      if (role === 'admin' && !hasAdminPermission) {
        toast({
          title: "Access Denied",
          description: "You don't have administrator privileges.",
          variant: "destructive",
        });
        setUpdatingRole(false);
        return;
      }

      // Update the user's role in the database
      if (user?.id) {
        console.log(`Updating user profile to role: ${role}`);
        
        try {
          // First update user metadata
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { role: role }
          });
          
          if (metadataError) {
            console.error("Error updating user metadata:", metadataError);
            throw metadataError;
          }
        } catch (err) {
          console.error("Failed to update user metadata:", err);
          // Continue anyway as the RPC might still work
        }
        
        // Use the RPC function to update the profile safely
        const { error } = await supabase.rpc('upsert_profile', {
          user_id: user.id,
          user_role: role,
          first_name: '',
          last_name: ''
        });
        
        if (error) {
          console.error("Error updating role:", error);
          toast({
            title: "Role Update Failed",
            description: "Could not update your role. Please try again.",
            variant: "destructive"
          });
          setUpdatingRole(false);
          return;
        }
        
        toast({
          title: "Role Updated",
          description: `You are now accessing the ${role} dashboard`,
        });
      }

      // Navigate to the appropriate dashboard
      navigate(role === 'admin' ? '/admin' : '/supplier/dashboard');
    } catch (error) {
      console.error("Role selection error:", error);
      toast({
        title: "Navigation Error",
        description: "Could not access the selected dashboard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingRole(false);
    }
  };

  return {
    isLoading,
    updatingRole,
    error,
    hasAdminPermission,
    selectRole
  };
};
