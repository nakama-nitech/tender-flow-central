
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmailFieldProps {
  email: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  error: string | undefined;
  emailAlreadyExists: boolean;
  setLoginForm: (form: { email: string; password: string }) => void;
  setSearchParams: any;
}

const EmailField: React.FC<EmailFieldProps> = ({
  email,
  onChange,
  onBlur,
  error,
  emailAlreadyExists,
  setLoginForm,
  setSearchParams
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="form-label">Email Address <span className="text-destructive">*</span></Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="Enter email address" 
        value={email}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        required
        className={cn(
          "border-primary/20",
          (error || emailAlreadyExists) ? "border-destructive" : ""
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      {emailAlreadyExists && !error && (
        <div className="flex items-center mt-1">
          <p className="text-xs text-blue-600">
            Email already registered. 
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto ml-1 text-xs"
              onClick={() => {
                setLoginForm({
                  email: email,
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
  );
};

export default EmailField;
