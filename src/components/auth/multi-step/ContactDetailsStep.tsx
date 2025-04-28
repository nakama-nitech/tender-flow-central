
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactDetailsStepProps {
  registerForm: any;
  setRegisterForm: (form: any) => void;
  registerFormErrors: any;
  setRegisterFormErrors: (errors: any) => void;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors
}) => {
  const getFieldError = (field: string) => {
    return registerFormErrors[field] ? (
      <p className="text-xs text-destructive mt-1">{registerFormErrors[field]}</p>
    ) : null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-lg font-medium flex items-center">
        <Phone className="h-5 w-5 mr-2 text-primary" />
        <span>Contact Details</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactName" className="form-label">Contact Name <span className="text-destructive">*</span></Label>
          <Input 
            id="contactName"
            placeholder="First & Last Name"
            value={registerForm.contactName}
            onChange={(e) => {
              setRegisterForm({...registerForm, contactName: e.target.value});
              setRegisterFormErrors({...registerFormErrors, contactName: ''});
            }}
            required
            className={cn(
              "border-primary/20",
              registerFormErrors.contactName ? "border-destructive" : ""
            )}
          />
          {getFieldError('contactName')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="form-label">Phone Number <span className="text-destructive">*</span></Label>
          <div className="flex">
            <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
              <Phone className="h-4 w-4 text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">+254</span>
            </div>
            <Input 
              id="phoneNumber"
              className={cn(
                "rounded-l-none border-primary/20",
                registerFormErrors.phoneNumber ? "border-destructive" : ""
              )}
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
          <Label htmlFor="kraPin" className="form-label">KRA PIN Number <span className="text-destructive">*</span></Label>
          <Input 
            id="kraPin"
            placeholder="Enter Tax Identification Number"
            value={registerForm.kraPin}
            onChange={(e) => {
              setRegisterForm({...registerForm, kraPin: e.target.value});
              setRegisterFormErrors({...registerFormErrors, kraPin: ''});
            }}
            required
            className={cn(
              "border-primary/20",
              registerFormErrors.kraPin ? "border-destructive" : ""
            )}
          />
          {getFieldError('kraPin')}
        </div>

        <div className="space-y-2">
          <Label htmlFor="physicalAddress" className="form-label">Physical Address</Label>
          <Textarea 
            id="physicalAddress"
            placeholder="P.O. Box address"
            value={registerForm.physicalAddress}
            onChange={(e) => setRegisterForm({...registerForm, physicalAddress: e.target.value})}
            className="border-primary/20 min-h-[80px] bg-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="websiteUrl" className="form-label">Website or Social Media URL</Label>
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
    </div>
  );
};

export default ContactDetailsStep;
