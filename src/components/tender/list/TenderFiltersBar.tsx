
import React from 'react';
import { Button } from '@/components/ui/button';
import { TenderCategory, TenderStatus } from '@/types/tender';
import { Tag, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TenderFiltersBarProps {
  selectedCategories: TenderCategory[];
  selectedStatuses: TenderStatus[];
  onCategoryToggle: (category: TenderCategory) => void;
  onStatusToggle: (status: TenderStatus) => void;
}

export const TenderFiltersBar = ({
  selectedCategories,
  selectedStatuses,
  onCategoryToggle,
  onStatusToggle,
}: TenderFiltersBarProps) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Tag className="h-4 w-4" />
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {['draft', 'published', 'under_evaluation', 'awarded', 'closed'].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selectedStatuses.includes(status as TenderStatus)}
              onCheckedChange={() => onStatusToggle(status as TenderStatus)}
            >
              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
