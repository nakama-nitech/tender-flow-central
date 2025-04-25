
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TenderSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TenderSearchBar = ({ searchTerm, onSearchChange }: TenderSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search tenders..." 
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
