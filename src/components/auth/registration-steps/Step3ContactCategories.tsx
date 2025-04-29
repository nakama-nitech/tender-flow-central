
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, ShieldCheck, MapPin, Briefcase } from 'lucide-react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { Category } from '../RegisterFormTypes';

interface Step3Props {
  registerForm: RegisterFormState;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  registerFormErrors: RegisterFormErrors;
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  categories: Category[];
  availableLocations: string[];
}

export const Step3ContactCategories: React.FC<Step3Props> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  categories,
  availableLocations
}) => {
  
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };
  
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        <h3 className="text-xl font-bold">Contact Information & Categories</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Add contact details and categories of interest
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <div className="text-xs text-muted-foreground mt-4">
          Fields marked with <span className="text-red-500">*</span> are required
        </div>
      </div>
    </div>
  );
};
