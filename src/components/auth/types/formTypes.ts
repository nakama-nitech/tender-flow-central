
// Common form types for auth components
export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  companyType: string;
  companyName: string;
  location: string;
  country: string;
  contactName: string;
  phoneNumber: string;
  kraPin: string;
  physicalAddress: string;
  websiteUrl: string;
  categoriesOfInterest: string[];
  supplyLocations: string[];
  agreeToTerms: boolean;
  currentStep: number;
}

export interface RegisterFormErrors {
  [key: string]: string;
}

export interface CountryLocations {
  [country: string]: string[];
}
