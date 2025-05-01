
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { useEmailCheck } from '@/components/auth/hooks/useEmailCheck';

interface Step1AccountDetailsProps {
  registerForm: RegisterFormState;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  registerFormErrors: RegisterFormErrors;
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  emailAlreadyExists: boolean;
  checkEmailExists: (email: string) => Promise<boolean>;
  loginForm: { email: string; password: string };
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setSearchParams: (searchParams: URLSearchParams) => void;
}

export const Step1AccountDetails: React.FC<Step1AccountDetailsProps> = ({ 
  registerForm, 
  setRegisterForm, 
  registerFormErrors, 
  setRegisterFormErrors,
  emailAlreadyExists,
  checkEmailExists,
  loginForm,
  setLoginForm,
  setSearchParams
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isChecking } = useEmailCheck(); // Get isChecking from the hook
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterForm({ ...registerForm, [id]: value });
    
    // Clear any validation errors for this field
    if (registerFormErrors[id]) {
      setRegisterFormErrors({ ...registerFormErrors, [id]: '' });
    }
  };
  
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    
    if (email && typeof checkEmailExists === 'function') {
      try {
        const exists = await checkEmailExists(email);
        if (exists) {
          setRegisterFormErrors({ 
            ...registerFormErrors, 
            email: 'Email is already registered. Please login instead.' 
          });
          
          // Pre-populate the login form with the email
          setLoginForm({
            ...loginForm,
            email: email
          });
          
          // Add a button to switch to login tab
          document.getElementById('switch-to-login')?.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }
  };
  
  const handleSwitchToLogin = () => {
    setSearchParams(new URLSearchParams({ tab: 'login' }));
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={registerForm.email}
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            className={`${registerFormErrors.email ? 'border-red-500' : 'border-input'}`}
            required
          />
          {isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          {emailAlreadyExists && !isChecking && (
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
          )}
          {registerForm.email && !registerFormErrors.email && !isChecking && !emailAlreadyExists && (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
          )}
        </div>
        {registerFormErrors.email && (
          <div className="text-sm text-red-500 mt-1">{registerFormErrors.email}</div>
        )}
        {emailAlreadyExists && (
          <Button 
            id="switch-to-login"
            type="button" 
            variant="link" 
            className="text-primary p-0 h-auto text-sm mt-1"
            onClick={handleSwitchToLogin}
          >
            Switch to login
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={registerForm.password}
            onChange={handleInputChange}
            className={`${registerFormErrors.password ? 'border-red-500' : 'border-input'} pr-10`}
            required
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {registerFormErrors.password && (
          <div className="text-sm text-red-500 mt-1">{registerFormErrors.password}</div>
        )}
        <div className="text-xs text-gray-500">Password must be at least 6 characters</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={registerForm.confirmPassword}
            onChange={handleInputChange}
            className={`${registerFormErrors.confirmPassword ? 'border-red-500' : 'border-input'} pr-10`}
            required
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {registerFormErrors.confirmPassword && (
          <div className="text-sm text-red-500 mt-1">{registerFormErrors.confirmPassword}</div>
        )}
      </div>
    </div>
  );
};
