
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TenderListHeaderProps {
  onNewTender: () => void;
}

export const TenderListHeader: React.FC<TenderListHeaderProps> = ({ onNewTender }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Tenders</h2>
        <p className="text-muted-foreground">
          Create and manage tender opportunities
        </p>
      </div>
      <Button className="gap-2" onClick={onNewTender}>
        <Plus className="h-4 w-4" />
        Create Tender
      </Button>
    </div>
  );
};
