
import React from 'react';
import AccountDetailsHeader from './account-details/AccountDetailsHeader';
import EmailField from './account-details/EmailField';
import PasswordFields from './account-details/PasswordFields';
import CategoriesField from './account-details/CategoriesField';
import LocationsField from './account-details/LocationsField';
import TermsAgreement from './account-details/TermsAgreement';
import { Category } from '../RegisterFormTypes';

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
  // Handle email change
  const handleEmailChange = (value: string) => {
    setRegisterForm({...registerForm, email: value});
    setRegisterFormErrors({...registerFormErrors, email: ''});
    
    // Clear the emailAlreadyExists flag when the user edits the email field
    if (emailAlreadyExists) {
      setEmailAlreadyExists(false);
    }
  };
  
  // Handle email blur for validation
  const handleEmailBlur = (value: string) => {
    if (value) {
      checkEmailExists(value);
    }
  };
  
  // Handle password change
  const handlePasswordChange = (value: string) => {
    setRegisterForm({...registerForm, password: value});
    setRegisterFormErrors({...registerFormErrors, password: ''});
  };
  
  // Handle confirm password change
  const handleConfirmPasswordChange = (value: string) => {
    setRegisterForm({...registerForm, confirmPassword: value});
    setRegisterFormErrors({...registerFormErrors, confirmPassword: ''});
  };
  
  // Handle categories change
  const handleCategoriesChange = (categories: string[]) => {
    setRegisterForm({...registerForm, categoriesOfInterest: categories});
    setRegisterFormErrors({...registerFormErrors, categoriesOfInterest: ''});
  };
  
  // Handle locations change
  const handleLocationsChange = (locations: string[]) => {
    setRegisterForm({...registerForm, supplyLocations: locations});
  };
  
  // Handle terms agreement
  const handleTermsChange = (agreed: boolean) => {
    setRegisterForm({...registerForm, agreeToTerms: agreed});
    setRegisterFormErrors({...registerFormErrors, agreeToTerms: ''});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AccountDetailsHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmailField
          email={registerForm.email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          error={registerFormErrors.email}
          emailAlreadyExists={emailAlreadyExists}
          setLoginForm={setLoginForm}
          setSearchParams={setSearchParams}
        />

        <PasswordFields
          password={registerForm.password}
          confirmPassword={registerForm.confirmPassword}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          passwordError={registerFormErrors.password}
          confirmPasswordError={registerFormErrors.confirmPassword}
        />

        <CategoriesField
          categories={categories}
          selectedCategories={registerForm.categoriesOfInterest}
          onChange={handleCategoriesChange}
          error={registerFormErrors.categoriesOfInterest}
        />
        
        <LocationsField
          country={registerForm.country}
          availableLocations={availableLocations}
          selectedLocations={registerForm.supplyLocations}
          onChange={handleLocationsChange}
        />
        
        <TermsAgreement
          agreed={registerForm.agreeToTerms}
          onChange={handleTermsChange}
          error={registerFormErrors.agreeToTerms}
        />
      </div>
    </div>
  );
};

export default AccountDetailsStep;
