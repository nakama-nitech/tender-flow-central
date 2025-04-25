
import React from 'react';
import { Search, Filter, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TenderCategory, TenderStatus } from '@/types/tender';

interface TenderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategories: TenderCategory[];
  onCategoryToggle: (category: TenderCategory) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export const TenderFilters: React.FC<TenderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  statusFilter,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tenders..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes('construction')}
              onCheckedChange={() => onCategoryToggle('construction')}
            >
              Construction
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes('services')}
              onCheckedChange={() => onCategoryToggle('services')}
            >
              Services
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes('goods')}
              onCheckedChange={() => onCategoryToggle('goods')}
            >
              Goods
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedCategories.includes('consulting')}
              onCheckedChange={() => onCategoryToggle('consulting')}
            >
              Consulting
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
