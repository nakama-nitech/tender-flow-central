
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TenderFormHeaderProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const TenderFormHeader = ({ isEditing, onCancel }: TenderFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Tender' : 'Create New Tender'}
        </h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Update tender details and requirements' 
            : 'Create a new tender notice or request for proposal'}
        </p>
      </div>
      <Button variant="ghost" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  );
};
