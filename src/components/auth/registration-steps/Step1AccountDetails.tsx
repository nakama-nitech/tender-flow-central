
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step1Props {
  registerForm: RegisterFormState;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  registerFormErrors: RegisterFormErrors;
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  emailAlreadyExists: boolean;
  checkEmailExists?: (email: string) => Promise<boolean>;
  loginForm: { email: string; password: string };
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
}

export const Step1AccountDetails: React.FC<Step1Props> = ({
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
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  // Log to verify checkEmailExists is received
  useEffect(() => {
    console.log("[Step1AccountDetails] checkEmailExists function exists:", 
                !!checkEmailExists, typeof checkEmailExists);
  }, [checkEmailExists]);
  
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };
  
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (!email || !email.trim()) {
      return;
    }
    
    if (typeof checkEmailExists !== 'function') {
      console.error("[Step1AccountDetails] checkEmailExists function is not available or not a function!");
      return;
    }
    
    console.log("[Step1AccountDetails] handleEmailBlur: Checking email existence for:", email);
    setIsCheckingEmail(true);
    
    try {
      const exists = await checkEmailExists(email);
      console.log("[Step1AccountDetails] Email check completed successfully:", exists);
    } catch (err) {
      console.error("[Step1AccountDetails] Error in handleEmailBlur:", err);
    } finally {
      setIsCheckingEmail(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium mb-4">
        <h3 className="text-xl font-bold">Create Your Account</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your email and create a password to get started
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter email address" 
            value={registerForm.email}
            onChange={(e) => {
              setRegisterForm({...registerForm, email: e.target.value});
              setRegisterFormErrors({...registerFormErrors, email: ''});
            }}
            onBlur={handleEmailBlur}
            required
            className={`border-primary/20 ${registerFormErrors.email || emailAlreadyExists ? 'border-red-500' : ''}`}
          />
          {getFieldError('email')}
          {isCheckingEmail && (
            <p className="text-xs text-blue-600">Checking if email is available...</p>
          )}
          {emailAlreadyExists && !registerFormErrors.email && !isCheckingEmail && (
            <div className="flex items-center mt-1">
              <p className="text-xs text-blue-600">
                Email already registered. 
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto ml-1 text-xs"
                  onClick={() => {
                    setLoginForm({...loginForm, email: registerForm.email});
                    setSearchParams(params => {
                      const newParams = new URLSearchParams(params);
                      newParams.set('tab', 'login');
                      return newParams;
                    });
                  }}
                >
                  Login instead?
                </Button>
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={registerForm.password}
              onChange={(e) => {
                setRegisterForm({...registerForm, password: e.target.value});
                setRegisterFormErrors({...registerFormErrors, password: ''});
              }}
              required
              className={`border-primary/20 pr-10 ${registerFormErrors.password ? 'border-red-500' : ''}`}
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
          {getFieldError('password')}
          <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={registerForm.confirmPassword}
              onChange={(e) => {
                setRegisterForm({...registerForm, confirmPassword: e.target.value});
                setRegisterFormErrors({...registerFormErrors, confirmPassword: ''});
              }}
              required
              className={`border-primary/20 pr-10 ${registerFormErrors.confirmPassword ? 'border-red-500' : ''}`}
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
          {getFieldError('confirmPassword')}
        </div>
      </div>
    </div>
  );
};
