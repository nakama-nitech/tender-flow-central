
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DeadlineItemProps {
  title: string;
  category: string;
  budget: string;
  daysRemaining: number;
}

const DeadlineItem: React.FC<DeadlineItemProps> = ({ 
  title, 
  category, 
  budget, 
  daysRemaining 
}) => {
  const getStatusColor = (days: number) => {
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-amber-500";
    return "text-green-500";
  };

  const colorClass = getStatusColor(daysRemaining);
  const ArrowIcon = daysRemaining <= 3 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{category} • {budget}</p>
      </div>
      <div className="flex items-center gap-2">
        <ArrowIcon className={`h-4 w-4 ${colorClass}`} />
        <span className={`text-sm font-medium ${colorClass}`}>{daysRemaining} days</span>
      </div>
    </div>
  );
};

export default DeadlineItem;
