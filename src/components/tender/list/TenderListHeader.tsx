
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
        <h2 className="text-3xl font-bold tracking-tight">Tenders</h2>
        <p className="text-muted-foreground">
          Manage your tender notices and RFPs
        </p>
      </div>
      <Button onClick={onNewTender}>
        <Plus className="mr-2 h-4 w-4" />
        New Tender
      </Button>
    </div>
  );
};
