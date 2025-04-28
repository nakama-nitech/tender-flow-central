
import React from "react";
import { Outlet } from "react-router-dom";
import { useRequiredRoleValidation } from "@/hooks/useRequiredRoleValidation";
import SupplierSidebar from "@/components/SupplierSidebar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const SupplierLayout: React.FC = () => {
  // Validate that the user has supplier role
  const { isLoading, hasAccess } = useRequiredRoleValidation("supplier");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-primary border-t-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-8 text-center">
        <div className="bg-card p-8 rounded-lg max-w-md shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the supplier dashboard. Please log in with a supplier account.
          </p>
          <div className="mt-6">
            <a
              href="/auth?tab=login"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <SupplierSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Supplier Pro Africa</h1>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <span className="text-sm text-muted-foreground">
              Supplier Dashboard
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupplierLayout;
