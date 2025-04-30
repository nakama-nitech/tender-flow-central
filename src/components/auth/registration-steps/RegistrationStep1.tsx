
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';

interface RegistrationStep1Props {
  registerForm: RegisterFormState;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  registerFormErrors: RegisterFormErrors;
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  emailAlreadyExists: boolean;
  setEmailAlreadyExists: React.Dispatch<React.SetStateAction<boolean>>;
  checkEmailExists?: (email: string) => Promise<boolean>;
  loginForm: { email: string; password: string };
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
}

export const RegistrationStep1: React.FC<RegistrationStep1Props> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  emailAlreadyExists,
  setEmailAlreadyExists,
  checkEmailExists,
  loginForm,
  setLoginForm,
  setSearchParams
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter email address" 
            value={registerForm.email}
            onChange={(e) => {
              setRegisterForm({...registerForm, email: e.target.value});
              setRegisterFormErrors({...registerFormErrors, email: ''});
              // Clear the emailAlreadyExists flag when the user edits the email field
              if (emailAlreadyExists) {
                setEmailAlreadyExists(false);
              }
            }}
            onBlur={(e) => {
              if (e.target.value && typeof checkEmailExists === 'function') {
                checkEmailExists(e.target.value).catch(error => {
                  console.error("Error checking email:", error);
                });
              }
            }}
            required
            className={`border-primary/20 ${registerFormErrors.email || emailAlreadyExists ? 'border-red-500' : ''}`}
          />
          {getFieldError('email')}
          {emailAlreadyExists && !registerFormErrors.email && (
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
          <Label htmlFor="password" className="flex items-center">
            <Lock className="h-4 w-4 mr-2 text-primary" />
            Password <span className="text-red-500">*</span>
          </Label>
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
          <Label htmlFor="confirmPassword" className="flex items-center">
            <Lock className="h-4 w-4 mr-2 text-primary" />
            Confirm Password <span className="text-red-500">*</span>
          </Label>
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
