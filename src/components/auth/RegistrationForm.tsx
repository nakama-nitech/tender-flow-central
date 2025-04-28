
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRegisterForm } from './hooks/useRegisterForm';
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
  } = useRegisterForm(setSearchParams);
  
  // Update available locations when country changes
  useEffect(() => {
    if (registerForm.country && countryLocations[registerForm.country]) {
      const locations = countryLocations[registerForm.country] || [];
      // Just ensure we have the locations available
    }
  }, [registerForm.country, countryLocations]);

  // Render the multi-step registration form
  return (
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
  );
};

export default RegistrationForm;
