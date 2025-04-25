import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { TenderCategory, TenderStatus, Tender } from '@/types/tender';
import { TenderSearchBar } from './tender/list/TenderSearchBar';
import { TenderFiltersBar } from './tender/list/TenderFiltersBar';
import { TenderCard } from '@/components/admin/tenders/TenderCard';
import { EmptyTenderState } from '@/components/admin/tenders/EmptyTenderState';

// Mock data for tenders
const mockTenders: Tender[] = [
  {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'IT Infrastructure Upgrade',
    description: 'Supply and installation of network equipment, servers, and workstations for headquarters.',
    category: 'goods',
    budget: 250000,
    deadline: '2025-04-28T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-18T14:15:00Z'
  },
  {
    id: '3',
    title: 'Annual Financial Audit',
    description: 'Professional services for annual financial audit and compliance review.',
    category: 'services',
    budget: 45000,
    deadline: '2025-05-15T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-20T09:45:00Z'
  },
  {
    id: '4',
    title: 'Marketing Strategy Consulting',
    description: 'Development of comprehensive marketing strategy and digital presence enhancement.',
    category: 'consulting',
    budget: 85000,
    deadline: '2025-04-25T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-22T11:20:00Z'
  },
  {
    id: '5',
    title: 'Office Furniture Procurement',
    description: 'Supply of ergonomic office furniture for 100 workstations.',
    category: 'goods',
    budget: 120000,
    deadline: '2025-05-10T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-25T16:10:00Z'
  },
  {
    id: '6',
    title: 'Corporate Event Planning',
    description: 'Full-service planning and coordination for annual corporate conference.',
    category: 'services',
    budget: 180000,
    deadline: '2025-06-01T23:59:59Z',
    status: 'draft',
    createdAt: '2025-03-28T13:40:00Z'
  }
];

// Status badge helper function
const getStatusBadge = (status: TenderStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'published':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Published</Badge>;
    case 'under_evaluation':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Under Evaluation</Badge>;
    case 'awarded':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Awarded</Badge>;
    case 'closed':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Closed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Category badge helper function
const getCategoryBadge = (category: TenderCategory) => {
  switch (category) {
    case 'construction':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{category}</Badge>;
    case 'services':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
    case 'goods':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
    case 'consulting':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
    case 'other':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
    default:
      return <Badge>{category}</Badge>;
  }
};

interface TenderListProps {
  onNewTender: () => void;
  onViewDetails: (tenderId: string) => void;
  onManageBids: (tenderId: string) => void;
}

const TenderList: React.FC<TenderListProps> = ({ onNewTender, onViewDetails, onManageBids }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TenderStatus[]>([]);

  // Filter tenders based on search term and selected filters
  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesStatus = 
      selectedStatuses.length === 0 || 
      selectedStatuses.includes(tender.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleStatus = (status: TenderStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tenders</h2>
          <p className="text-muted-foreground">
            Manage your tender notices and RFPs
          </p>
        </div>
        <Button onClick={onNewTender}>
          <Plus className="mr-2 h-4 w-4" />
          New Tender
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <TenderSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <TenderFiltersBar
          selectedCategories={selectedCategories}
          selectedStatuses={selectedStatuses}
          onCategoryToggle={toggleCategory}
          onStatusToggle={toggleStatus}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onEdit={onViewDetails}
            onViewBids={onManageBids}
          />
        ))}
      </div>
      
      {filteredTenders.length === 0 && (
        <EmptyTenderState onNewTender={onNewTender} />
      )}
    </div>
  );
};

export default TenderList;
