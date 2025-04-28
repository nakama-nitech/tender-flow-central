
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { CompanyType } from '../RegisterFormTypes';

interface CompanyDetailsStepProps {
  registerForm: any;
  setRegisterForm: (form: any) => void;
  registerFormErrors: any;
  setRegisterFormErrors: (errors: any) => void;
  companyTypes: CompanyType[];
}

const CompanyDetailsStep: React.FC<CompanyDetailsStepProps> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  companyTypes
}) => {
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium flex items-center">
        <Building className="h-5 w-5 mr-2 text-primary" />
        <span>Company Details</span>
      </div>
      
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
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
