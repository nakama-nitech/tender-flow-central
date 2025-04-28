
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '../../RegisterFormTypes';

interface CategoriesFieldProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  error: string | undefined;
}

const CategoriesField: React.FC<CategoriesFieldProps> = ({
  categories,
  selectedCategories,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="categoriesOfInterest" className="flex items-center form-label">
        <Briefcase className="h-4 w-4 mr-2 text-primary" />
        Categories of Interest <span className="text-destructive">*</span>
      </Label>
      <Select
        value={selectedCategories.join(',')}
        onValueChange={(value) => {
          const selected = value ? value.split(',') : [];
          onChange(selected);
        }}
      >
        <SelectTrigger className={cn(
          "border-primary/20 bg-background",
          error ? "border-destructive" : ""
        )}>
          <SelectValue placeholder="Select categories of interest" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border z-50">
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default CategoriesField;
