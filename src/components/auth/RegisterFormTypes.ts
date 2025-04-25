
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
}

export interface RegisterFormErrors {
  [key: string]: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CompanyType {
  id: number;
  name: string;
}

export interface CountryLocations {
  [key: string]: string[];
}
