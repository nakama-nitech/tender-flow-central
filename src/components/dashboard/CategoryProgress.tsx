
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CategoryProgressProps {
  name: string;
  percentage: number;
  color: string;
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({ 
  name, 
  percentage, 
  color 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${color}`}></span>
          <span className="text-sm">{name}</span>
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className={`bg-muted ${color !== 'bg-primary' ? `[&>div]:${color}` : ''}`} 
      />
    </div>
  );
};

export default CategoryProgress;
