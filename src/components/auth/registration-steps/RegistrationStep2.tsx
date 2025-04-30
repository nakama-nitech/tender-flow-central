
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Globe } from 'lucide-react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { CompanyType, CountryLocations } from '../RegisterFormTypes';

interface RegistrationStep2Props {
  registerForm: RegisterFormState;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterFormState>>;
  registerFormErrors: RegisterFormErrors;
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  companyTypes: CompanyType[];
  countryLocations: CountryLocations;
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  companyTypes,
  countryLocations
}) => {
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };
  
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
