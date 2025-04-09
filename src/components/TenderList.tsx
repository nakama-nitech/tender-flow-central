
import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, DollarSign, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tender, TenderCategory, TenderStatus } from '@/types/tender';
import { format } from 'date-fns';

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenders..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                onCheckedChange={() => toggleCategory('construction')}
              >
                Construction
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes('services')}
                onCheckedChange={() => toggleCategory('services')}
              >
                Services
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes('goods')}
                onCheckedChange={() => toggleCategory('goods')}
              >
                Goods
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes('consulting')}
                onCheckedChange={() => toggleCategory('consulting')}
              >
                Consulting
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes('other')}
                onCheckedChange={() => toggleCategory('other')}
              >
                Other
              </DropdownMenuCheckboxItem>
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
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('draft')}
                onCheckedChange={() => toggleStatus('draft')}
              >
                Draft
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('published')}
                onCheckedChange={() => toggleStatus('published')}
              >
                Published
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('under_evaluation')}
                onCheckedChange={() => toggleStatus('under_evaluation')}
              >
                Under Evaluation
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('awarded')}
                onCheckedChange={() => toggleStatus('awarded')}
              >
                Awarded
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes('closed')}
                onCheckedChange={() => toggleStatus('closed')}
              >
                Closed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTenders.map((tender) => (
          <Card key={tender.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{tender.title}</CardTitle>
                {getStatusBadge(tender.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {tender.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Deadline: {formatDate(tender.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Budget: {formatCurrency(tender.budget)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>{getCategoryBadge(tender.category)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created: {formatDate(tender.createdAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(tender.id)}
              >
                View Details
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onManageBids(tender.id)}
              >
                Manage Bids
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTenders.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No tenders found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={onNewTender}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Tender
          </Button>
        </div>
      )}
    </div>
  );
};

export default TenderList;
