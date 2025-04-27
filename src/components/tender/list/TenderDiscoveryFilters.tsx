
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, DollarSign } from 'lucide-react';
import { TenderCategory } from '@/types/tender';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TenderDiscoveryFiltersProps {
  searchTerm: string;
  selectedCategories: TenderCategory[];
  budgetRange: string;
  onSearchChange: (value: string) => void;
  onCategoryToggle: (category: TenderCategory) => void;
  onBudgetChange: (value: string) => void;
}

export const TenderDiscoveryFilters: React.FC<TenderDiscoveryFiltersProps> = ({
  searchTerm,
  selectedCategories,
  budgetRange,
  onSearchChange,
  onCategoryToggle,
  onBudgetChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tenders by keyword..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['construction', 'services', 'goods', 'consulting', 'other'].map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category as TenderCategory)}
                onCheckedChange={() => onCategoryToggle(category as TenderCategory)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Select value={budgetRange} onValueChange={onBudgetChange}>
          <SelectTrigger className="w-[140px]">
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            <SelectItem value="low">Under 50K</SelectItem>
            <SelectItem value="medium">50K - 250K</SelectItem>
            <SelectItem value="high">Over 250K</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
