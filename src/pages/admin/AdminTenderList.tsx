
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, DollarSign, Clock, Plus, FileText } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TenderCategory, TenderStatus, Tender } from '@/types/tender';
import { format } from 'date-fns';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Mock data for tenders - in a real app, this would come from the backend
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
  }
];

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

const AdminTenderList: React.FC = () => {
  useAdminAuth(); // This ensures only admins can access this page
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter tenders based on search term and selected filters
  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      statusFilter === tender.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Tenders</h2>
          <p className="text-muted-foreground">
            Create and manage tender opportunities
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/admin/create-tender')}>
          <Plus className="h-4 w-4" />
          Create Tender
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
                <Filter className="h-4 w-4" />
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
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTenders.map((tender) => {
          const deadline = new Date(tender.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = daysLeft <= 7;
          
          return (
            <Card key={tender.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tender.title}</CardTitle>
                  <Badge variant={tender.status === 'published' ? 'default' : 'outline'}>
                    {tender.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {tender.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm flex justify-between w-full">
                      <span>Deadline: {formatDate(tender.deadline)}</span>
                      <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>{daysLeft} days left</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Budget: {formatCurrency(tender.budget)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div>{getCategoryBadge(tender.category)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Posted: {formatDate(tender.createdAt)}</span>
                  </div>
                  
                  <div className="pt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="default" className="flex-1">
                      View Bids
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredTenders.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No tenders found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => navigate('/admin/create-tender')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Tender
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminTenderList;
