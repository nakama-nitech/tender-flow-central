
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { CompanyType } from '../RegisterFormTypes';
import { cn } from '@/lib/utils';

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
      <p className="text-xs text-destructive mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-lg font-medium flex items-center">
        <Building className="h-5 w-5 mr-2 text-primary" />
        <span>Company Details</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyType" className="form-label">Company Type <span className="text-destructive">*</span></Label>
          <Select 
            value={registerForm.companyType}
            onValueChange={(value) => {
              setRegisterForm({...registerForm, companyType: value});
              setRegisterFormErrors({...registerFormErrors, companyType: ''});
            }}
            required
          >
            <SelectTrigger 
              className={cn(
                "border-primary/20 bg-background",
                registerFormErrors.companyType ? "border-destructive" : ""
              )}
            >
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
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
          <Label htmlFor="companyName" className="form-label">Company Name <span className="text-destructive">*</span></Label>
          <Input 
            id="companyName"
            placeholder="Enter company name"
            value={registerForm.companyName}
            onChange={(e) => {
              setRegisterForm({...registerForm, companyName: e.target.value});
              setRegisterFormErrors({...registerFormErrors, companyName: ''});
            }}
            required
            className={cn(
              "border-primary/20",
              registerFormErrors.companyName ? "border-destructive" : ""
            )}
          />
          {getFieldError('companyName')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="form-label">Location <span className="text-destructive">*</span></Label>
          <Input 
            id="location"
            placeholder="Enter location"
            value={registerForm.location}
            onChange={(e) => {
              setRegisterForm({...registerForm, location: e.target.value});
              setRegisterFormErrors({...registerFormErrors, location: ''});
            }}
            required
            className={cn(
              "border-primary/20",
              registerFormErrors.location ? "border-destructive" : ""
            )}
          />
          {getFieldError('location')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country" className="form-label">Country <span className="text-destructive">*</span></Label>
          <Select 
            value={registerForm.country}
            onValueChange={(value) => setRegisterForm({...registerForm, country: value, supplyLocations: []})}
            required
          >
            <SelectTrigger className="border-primary/20 bg-background">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
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
