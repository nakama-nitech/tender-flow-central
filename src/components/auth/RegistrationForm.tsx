import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterForm } from './hooks/useRegisterForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleChange,
    onSubmit,
    isLoading,
    error,
    isChecking
  } = useRegisterForm(undefined, navigate);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter your company name"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
          disabled={isLoading || isChecking}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isChecking}
      >
        {(isLoading || isChecking) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isChecking ? 'Checking email...' : 'Registering...'}
          </>
        ) : (
          'Register'
        )}
      </Button>
    </form>
  );
};
