
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  disabled = false 
}) => {
  return (
    <Button
      variant="outline"
      className={`h-auto p-6 flex flex-col items-center gap-4 border-2 ${
        !disabled ? 'border-primary hover:border-primary hover:bg-primary/5' : 'opacity-50 cursor-not-allowed'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-12 w-12 text-primary" />
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </Button>
  );
};

export default RoleCard;
