
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    
    // Validate form fields
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Please enter both email and password");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) throw error;
      
      console.log("Login successful, session:", data.session);
      
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Redirect to the handler which will determine where to send the user based on their role
      navigate('/redirect', { replace: true });
      
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Please check your credentials and try again");
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginForm({...loginForm, [id]: value});
    
    // Clear error when user starts typing again
    if (loginError) {
      setLoginError(null);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="supplier@example.com" 
            value={loginForm.email}
            onChange={handleInputChange}
            required
            className={`border-primary/20 focus:border-primary ${loginError ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={loginForm.password}
              onChange={handleInputChange}
              required
              className={`border-primary/20 focus:border-primary pr-10 ${loginError ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {loginError && (
          <div className="text-sm text-red-500 mt-2">{loginError}</div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Logging in...
            </>
          ) : "Login"}
        </Button>
      </CardFooter>
    </form>
  );
};
