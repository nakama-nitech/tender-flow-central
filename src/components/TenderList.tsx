
import React, { useState } from 'react';
import { TenderCategory, TenderStatus, Tender } from '@/types/tender';
import { TenderSearchBar } from './tender/list/TenderSearchBar';
import { TenderFiltersBar } from './tender/list/TenderFiltersBar';
import { TenderListHeader } from './tender/list/TenderListHeader';
import { TenderCard } from '@/components/admin/tenders/TenderCard';
import { EmptyTenderState } from '@/components/admin/tenders/EmptyTenderState';
import { mockTenders } from '@/data/mockTenders';

interface TenderListProps {
  onNewTender: () => void;
  onViewDetails: (tenderId: string) => void;
  onManageBids: (tenderId: string) => void;
}

const TenderList: React.FC<TenderListProps> = ({ 
  onNewTender, 
  onViewDetails, 
  onManageBids 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TenderStatus[]>([]);

  // Filter tenders based on search term and selected filters
  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesStatus = 
      selectedStatuses.length === 0 || 
      selectedStatuses.includes(tender.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleStatus = (status: TenderStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  return (
    <div className="space-y-4">
      <TenderListHeader onNewTender={onNewTender} />

      <div className="flex flex-col sm:flex-row gap-4">
        <TenderSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <TenderFiltersBar
          selectedCategories={selectedCategories}
          selectedStatuses={selectedStatuses}
          onCategoryToggle={toggleCategory}
          onStatusToggle={toggleStatus}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onEdit={onViewDetails}
            onViewBids={onManageBids}
          />
        ))}
      </div>
      
      {filteredTenders.length === 0 && (
        <EmptyTenderState onNewTender={onNewTender} />
      )}
    </div>
  );
};

export default TenderList;
