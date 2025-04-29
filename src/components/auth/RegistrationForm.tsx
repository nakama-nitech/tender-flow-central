import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building, Phone, Globe, ShieldCheck, Eye, EyeOff, MapPin, Briefcase, ChevronLeft, ChevronRight, User, Mail, Lock } from 'lucide-react';
import { useRegisterForm } from './hooks/useRegisterForm';
import { CompanyType, Category, CountryLocations } from './RegisterFormTypes';

interface RegistrationFormProps {
  companyTypes: CompanyType[];
  categories: Category[];
  availableLocations: string[];
  countryLocations: CountryLocations;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  companyTypes, 
  categories, 
  availableLocations,
  countryLocations
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    handleRegisterSubmit,
    checkEmailExists,  // Make sure we're destructuring this
    loginForm,
    setLoginForm
  } = useRegisterForm(setSearchParams);
  
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      // Email validation
      if (!registerForm.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Password validation
      if (!registerForm.password) {
        errors.password = 'Password is required';
      } else if (registerForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      
      // Confirm password
      if (!registerForm.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (registerForm.password !== registerForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      // Company type validation
      if (!registerForm.companyType) {
        errors.companyType = 'Please select a company type';
      }
      
      // Company name validation
      if (!registerForm.companyName) {
        errors.companyName = 'Company name is required';
      }
      
      // Location validation
      if (!registerForm.location) {
        errors.location = 'Location is required';
      }
      
      // KRA PIN validation
      if (!registerForm.kraPin) {
        errors.kraPin = 'KRA PIN is required';
      }
    } else if (step === 3) {
      // Contact name validation
      if (!registerForm.contactName) {
        errors.contactName = 'Contact name is required';
      }
      
      // Phone number validation
      if (!registerForm.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^\d+$/.test(registerForm.phoneNumber)) {
        errors.phoneNumber = 'Phone number must contain only digits';
      }
      
      // Categories validation
      if (registerForm.categoriesOfInterest.length === 0) {
        errors.categoriesOfInterest = 'Please select at least one category';
      }
      
      // Terms validation
      if (!registerForm.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Check if email exists before proceeding to next step
      const emailExists = await checkEmailExists(registerForm.email);
      if (emailExists) {
        return; // Don't proceed if email exists
      }
    }
    
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateStep(currentStep);
    if (isValid) {
      handleRegisterSubmit(e);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep === step 
                    ? 'bg-primary text-white' 
                    : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'}`}
              >
                {currentStep > step ? '✓' : step}
              </div>
              {step < 3 && (
                <div className={`w-20 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStepTitle = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="text-lg font-medium flex items-center mb-6">
            <User className="h-5 w-5 mr-2 text-primary" />
            <span>Account Details</span>
          </div>
        );
      case 2:
        return (
          <div className="text-lg font-medium flex items-center mb-6">
            <Building className="h-5 w-5 mr-2 text-primary" />
            <span>Company Details</span>
          </div>
        );
      case 3:
        return (
          <div className="text-lg font-medium flex items-center mb-6">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            <span>Preferences & Contact</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStep1 = () => {
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
                if (e.target.value) {
                  checkEmailExists(e.target.value);
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

  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyType">Company Type <span className="text-red-500">*</span></Label>
            <Select 
              value={registerForm.companyType}
              onValueChange={(value) => {
                setRegisterForm({...registerForm, companyType: value});
                setRegisterFormErrors({...registerFormErrors, companyType: ''});
              }}
              required
            >
              <SelectTrigger className={`border-primary/20 ${registerFormErrors.companyType ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map(type => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('companyType')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
            <Input 
              id="companyName"
              placeholder="Enter company name"
              value={registerForm.companyName}
              onChange={(e) => {
                setRegisterForm({...registerForm, companyName: e.target.value});
                setRegisterFormErrors({...registerFormErrors, companyName: ''});
              }}
              required
              className={`border-primary/20 ${registerFormErrors.companyName ? 'border-red-500' : ''}`}
            />
            {getFieldError('companyName')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
            <Input 
              id="location"
              placeholder="Enter location"
              value={registerForm.location}
              onChange={(e) => {
                setRegisterForm({...registerForm, location: e.target.value});
                setRegisterFormErrors({...registerFormErrors, location: ''});
              }}
              required
              className={`border-primary/20 ${registerFormErrors.location ? 'border-red-500' : ''}`}
            />
            {getFieldError('location')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
            <Select 
              value={registerForm.country}
              onValueChange={(value) => setRegisterForm({...registerForm, country: value, supplyLocations: []})}
              required
            >
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Uganda">Uganda</SelectItem>
                <SelectItem value="Tanzania">Tanzania</SelectItem>
                <SelectItem value="Rwanda">Rwanda</SelectItem>
                <SelectItem value="Ethiopia">Ethiopia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kraPin">KRA PIN Number <span className="text-red-500">*</span></Label>
            <Input 
              id="kraPin"
              placeholder="Enter Tax Identification Number"
              value={registerForm.kraPin}
              onChange={(e) => {
                setRegisterForm({...registerForm, kraPin: e.target.value});
                setRegisterFormErrors({...registerFormErrors, kraPin: ''});
              }}
              required
              className={`border-primary/20 ${registerFormErrors.kraPin ? 'border-red-500' : ''}`}
            />
            {getFieldError('kraPin')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website or Social Media URL</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <Input 
                id="websiteUrl"
                className="rounded-l-none border-primary/20"
                placeholder="http://www.example.com"
                value={registerForm.websiteUrl}
                onChange={(e) => setRegisterForm({...registerForm, websiteUrl: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="physicalAddress">Physical Address</Label>
          <Textarea 
            id="physicalAddress"
            placeholder="P.O. Box address"
            value={registerForm.physicalAddress}
            onChange={(e) => setRegisterForm({...registerForm, physicalAddress: e.target.value})}
            className="border-primary/20"
          />
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name <span className="text-red-500">*</span></Label>
            <Input 
              id="contactName"
              placeholder="First & Last Name"
              value={registerForm.contactName}
              onChange={(e) => {
                setRegisterForm({...registerForm, contactName: e.target.value});
                setRegisterFormErrors({...registerFormErrors, contactName: ''});
              }}
              required
              className={`border-primary/20 ${registerFormErrors.contactName ? 'border-red-500' : ''}`}
            />
            {getFieldError('contactName')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                <Phone className="h-4 w-4 text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">+254</span>
              </div>
              <Input 
                id="phoneNumber"
                className={`rounded-l-none border-primary/20 ${registerFormErrors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="7XX XXX XXX"
                value={registerForm.phoneNumber}
                onChange={(e) => {
                  setRegisterForm({...registerForm, phoneNumber: e.target.value});
                  setRegisterFormErrors({...registerFormErrors, phoneNumber: ''});
                }}
                required
              />
            </div>
            {getFieldError('phoneNumber')}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoriesOfInterest" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-primary" />
            Categories of Interest <span className="text-red-500">*</span>
          </Label>
          <Select
            value={registerForm.categoriesOfInterest.join(',')}
            onValueChange={(value) => {
              const selectedCategories = value ? value.split(',') : [];
              setRegisterForm({...registerForm, categoriesOfInterest: selectedCategories});
              setRegisterFormErrors({...registerFormErrors, categoriesOfInterest: ''});
            }}
          >
            <SelectTrigger className={`border-primary/20 ${registerFormErrors.categoriesOfInterest ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select categories of interest" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('categoriesOfInterest')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplyLocations" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Supply Locations in {registerForm.country}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-md border-primary/20 max-h-[200px] overflow-y-auto">
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
                        supplyLocations: registerForm.supplyLocations.filter(loc => loc !== location)
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
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={registerForm.agreeToTerms}
              onCheckedChange={(checked) => {
                setRegisterForm({...registerForm, agreeToTerms: checked as boolean});
                setRegisterFormErrors({...registerFormErrors, agreeToTerms: ''});
              }}
              className={`border-primary/40 data-[state=checked]:bg-primary ${registerFormErrors.agreeToTerms ? 'border-red-500' : ''}`}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
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
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {getFieldError('agreeToTerms')}
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Fields marked with <span className="text-red-500">*</span> are required
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    return (
      <div className="flex items-center justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreviousStep}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-4">
            {currentStep < 3 ? (
              <>You have an account? <Button variant="link" className="p-0" type="button" onClick={() => {
                setSearchParams(params => {
                  params.set('tab', 'login');
                  return params;
                });
              }}>Sign In</Button></>
            ) : null}
          </span>
          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={isSubmitting || emailAlreadyExists}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Creating account...
                </>
              ) : "Complete Registration"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={submitForm}>
      {renderStepIndicator()}
      {renderStepTitle()}
      {renderCurrentStep()}
      {renderNavigation()}
    </form>
  );
};
