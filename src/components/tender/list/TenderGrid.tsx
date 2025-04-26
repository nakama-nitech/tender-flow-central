
import React from 'react';
import { Tender } from '@/types/tender';
import { TenderCard } from '@/components/admin/tenders/TenderCard';
import { EmptyTenderState } from '@/components/admin/tenders/EmptyTenderState';

interface TenderGridProps {
  tenders: Tender[];
  onNewTender: () => void;
  onViewDetails: (tenderId: string) => void;
  onManageBids: (tenderId: string) => void;
}

export const TenderGrid: React.FC<TenderGridProps> = ({
  tenders,
  onNewTender,
  onViewDetails,
  onManageBids,
}) => {
  if (tenders.length === 0) {
    return <EmptyTenderState onNewTender={onNewTender} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tenders.map((tender) => (
        <TenderCard
          key={tender.id}
          tender={tender}
          onEdit={onViewDetails}
          onViewBids={onManageBids}
        />
      ))}
    </div>
  );
};
