
import { useState } from 'react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';

export const useFormValidation = () => {
  const [registerFormErrors, setRegisterFormErrors] = useState<RegisterFormErrors>({});

  const validateRegisterForm = (registerForm: RegisterFormState): boolean => {
    const errors: RegisterFormErrors = {};
    
    if (!registerForm.email) errors.email = "Email is required";
    if (!registerForm.password) errors.password = "Password is required";
    if (registerForm.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!registerForm.confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = "Passwords don't match";
    if (!registerForm.companyType) errors.companyType = "Company type is required";
    if (!registerForm.companyName) errors.companyName = "Company name is required";
    if (!registerForm.location) errors.location = "Location is required";
    if (!registerForm.contactName) errors.contactName = "Contact name is required";
    if (!registerForm.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!registerForm.kraPin) errors.kraPin = "Tax PIN is required";
    if (registerForm.categoriesOfInterest.length === 0) errors.categoriesOfInterest = "Please select at least one category";
    if (!registerForm.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    registerFormErrors,
    setRegisterFormErrors,
    validateRegisterForm
  };
};
