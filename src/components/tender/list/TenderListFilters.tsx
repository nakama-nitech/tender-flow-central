
import React from 'react';
import { TenderCategory, TenderStatus } from '@/types/tender';
import { TenderSearchBar } from './TenderSearchBar';
import { TenderFiltersBar } from './TenderFiltersBar';

interface TenderListFiltersProps {
  searchTerm: string;
  selectedCategories: TenderCategory[];
  selectedStatuses: TenderStatus[];
  onSearchChange: (value: string) => void;
  onCategoryToggle: (category: TenderCategory) => void;
  onStatusToggle: (status: TenderStatus) => void;
}

export const TenderListFilters: React.FC<TenderListFiltersProps> = ({
  searchTerm,
  selectedCategories,
  selectedStatuses,
  onSearchChange,
  onCategoryToggle,
  onStatusToggle,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <TenderSearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      <TenderFiltersBar
        selectedCategories={selectedCategories}
        selectedStatuses={selectedStatuses}
        onCategoryToggle={onCategoryToggle}
        onStatusToggle={onStatusToggle}
      />
    </div>
  );
};
