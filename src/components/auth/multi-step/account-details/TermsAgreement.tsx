
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermsAgreementProps {
  agreed: boolean;
  onChange: (agreed: boolean) => void;
  error: string | undefined;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreed,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2 md:col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreed}
          onCheckedChange={(checked) => onChange(!!checked)}
          className={cn(
            "border-primary/40 data-[state=checked]:bg-primary",
            error ? "border-destructive" : ""
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
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default TermsAgreement;
