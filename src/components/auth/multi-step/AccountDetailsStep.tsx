
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, MapPin, Briefcase, ShieldCheck } from 'lucide-react';
import { Category } from '../RegisterFormTypes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccountDetailsStepProps {
  registerForm: any;
  setRegisterForm: (form: any) => void;
  registerFormErrors: any;
  setRegisterFormErrors: (errors: any) => void;
  emailAlreadyExists: boolean;
  setEmailAlreadyExists: (exists: boolean) => void;
  checkEmailExists: (email: string) => Promise<boolean>;
  categories: Category[];
  availableLocations: string[];
  setLoginForm: (form: { email: string; password: string }) => void;
  setSearchParams: any;
}

const AccountDetailsStep: React.FC<AccountDetailsStepProps> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  emailAlreadyExists,
  setEmailAlreadyExists,
  checkEmailExists,
  categories,
  availableLocations,
  setLoginForm,
  setSearchParams
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-destructive mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-lg font-medium flex items-center text-primary-700">
        <Briefcase className="h-5 w-5 mr-2 text-primary" />
        <span>Account Details</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="form-label">Email Address <span className="text-destructive">*</span></Label>
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
              if (e.target.value) {
                checkEmailExists(e.target.value);
              }
            }}
            required
            className={cn(
              "border-primary/20",
              (registerFormErrors.email || emailAlreadyExists) ? "border-destructive" : ""
            )}
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
                    setLoginForm({
                      email: registerForm.email,
                      password: '' // Add empty password
                    });
                    setSearchParams(params => {
                      params.set('tab', 'login');
                      return params;
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
          <Label htmlFor="password" className="form-label">Password <span className="text-destructive">*</span></Label>
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
              className={cn(
                "border-primary/20 pr-10",
                registerFormErrors.password ? "border-destructive" : ""
              )}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
          <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-destructive">*</span></Label>
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
              className={cn(
                "border-primary/20 pr-10",
                registerFormErrors.confirmPassword ? "border-destructive" : ""
              )}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="categoriesOfInterest" className="flex items-center form-label">
            <Briefcase className="h-4 w-4 mr-2 text-primary" />
            Categories of Interest <span className="text-destructive">*</span>
          </Label>
          <Select
            value={registerForm.categoriesOfInterest.join(',')}
            onValueChange={(value) => {
              const selectedCategories = value ? value.split(',') : [];
              setRegisterForm({...registerForm, categoriesOfInterest: selectedCategories});
              setRegisterFormErrors({...registerFormErrors, categoriesOfInterest: ''});
            }}
          >
            <SelectTrigger className={cn(
              "border-primary/20 bg-background",
              registerFormErrors.categoriesOfInterest ? "border-destructive" : ""
            )}>
              <SelectValue placeholder="Select categories of interest" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('categoriesOfInterest')}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="supplyLocations" className="flex items-center form-label">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Supply Locations in {registerForm.country}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-md border-primary/20 bg-background max-h-[150px] overflow-y-auto">
            {availableLocations.map((location, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${index}`}
                  checked={registerForm.supplyLocations.includes(location)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRegisterForm({
                        ...registerForm,
                        supplyLocations: [...registerForm.supplyLocations, location]
                      });
                    } else {
                      setRegisterForm({
                        ...registerForm,
                        supplyLocations: registerForm.supplyLocations.filter((loc: string) => loc !== location)
                      });
                    }
                  }}
                  className="border-primary/40 data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor={`location-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={registerForm.agreeToTerms}
              onCheckedChange={(checked) => {
                setRegisterForm({...registerForm, agreeToTerms: !!checked});
                setRegisterFormErrors({...registerFormErrors, agreeToTerms: ''});
              }}
              className={cn(
                "border-primary/40 data-[state=checked]:bg-primary",
                registerFormErrors.agreeToTerms ? "border-destructive" : ""
              )}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center flex-wrap"
            >
              <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline mx-1">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline mx-1">
                Privacy Policy
              </a>
              <span className="text-destructive"> *</span>
            </label>
          </div>
          {getFieldError('agreeToTerms')}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsStep;
