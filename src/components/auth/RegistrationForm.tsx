
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { CompanyType, Category, CountryLocations } from './RegisterFormTypes';
import RegistrationSteps from './multi-step/RegistrationSteps';
import { useEmailCheck } from './hooks/useEmailCheck';

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
  
  // Use the email check hook
  const { emailAlreadyExists, setEmailAlreadyExists, checkEmailExists } = useEmailCheck();
  
  // Use the register form hook
  const {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    isSubmitting,
    handleRegisterSubmit,
    loginForm,
    setLoginForm
  } = useRegistrationForm(setSearchParams);
  
  // Update available locations when country changes
  useEffect(() => {
    if (registerForm.country && countryLocations[registerForm.country]) {
      // Just ensure we have the locations available
      const locations = countryLocations[registerForm.country] || [];
    }
  }, [registerForm.country, countryLocations]);

  // Render the multi-step registration form
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <RegistrationSteps 
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        registerFormErrors={registerFormErrors}
        setRegisterFormErrors={setRegisterFormErrors}
        emailAlreadyExists={emailAlreadyExists}
        setEmailAlreadyExists={setEmailAlreadyExists}
        checkEmailExists={checkEmailExists}
        isSubmitting={isSubmitting}
        handleRegisterSubmit={(e) => handleRegisterSubmit(e, registerForm)}
        setLoginForm={setLoginForm}
        setSearchParams={setSearchParams}
        companyTypes={companyTypes}
        categories={categories}
        availableLocations={availableLocations}
        countryLocations={countryLocations}
      />
    </div>
  );
};

export default RegistrationForm;
