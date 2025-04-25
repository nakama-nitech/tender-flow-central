
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTenderStateProps {
  onNewTender: () => void;
}

export const EmptyTenderState: React.FC<EmptyTenderStateProps> = ({ onNewTender }) => {
  return (
    <div className="border rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No tenders found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your search or filter criteria
      </p>
      <Button onClick={onNewTender}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Tender
      </Button>
    </div>
  );
};
