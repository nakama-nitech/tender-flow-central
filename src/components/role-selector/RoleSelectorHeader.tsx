
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RoleSelectorHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center bg-white shadow-sm">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </header>
  );
};

export default RoleSelectorHeader;
