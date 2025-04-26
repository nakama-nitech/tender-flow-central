
import React, { useState } from 'react';
import { TenderCategory, TenderStatus } from '@/types/tender';
import { TenderListHeader } from './tender/list/TenderListHeader';
import { TenderListFilters } from './tender/list/TenderListFilters';
import { TenderGrid } from './tender/list/TenderGrid';
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
      
      <TenderListFilters
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        selectedStatuses={selectedStatuses}
        onSearchChange={setSearchTerm}
        onCategoryToggle={toggleCategory}
        onStatusToggle={toggleStatus}
      />

      <TenderGrid
        tenders={filteredTenders}
        onNewTender={onNewTender}
        onViewDetails={onViewDetails}
        onManageBids={onManageBids}
      />
    </div>
  );
};

export default TenderList;
