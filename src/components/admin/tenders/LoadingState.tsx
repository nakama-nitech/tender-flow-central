
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
};
