
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, DollarSign, Clock, Bell, FileText } from 'lucide-react';
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
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TenderCategory, TenderStatus, Tender } from '@/types/tender';
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

const TenderDiscovery: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [budgetRange, setBudgetRange] = useState<string>('all');
  
  // Filter tenders based on search term and selected filters
  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesBudget = 
      budgetRange === 'all' ||
      (budgetRange === 'low' && tender.budget <= 50000) ||
      (budgetRange === 'medium' && tender.budget > 50000 && tender.budget <= 250000) ||
      (budgetRange === 'high' && tender.budget > 250000);
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleNotificationToggle = (tenderId: string) => {
    toast({
      title: "Notification Settings Updated",
      description: "You will receive updates about this tender",
    });
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Discover Tenders</h2>
        <p className="text-muted-foreground">
          Find opportunities that match your business capabilities
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenders by keyword..." 
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
          
          <Select value={budgetRange} onValueChange={setBudgetRange}>
            <SelectTrigger className="w-[140px]">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="low">Under 50K</SelectItem>
              <SelectItem value="medium">50K - 250K</SelectItem>
              <SelectItem value="high">Over 250K</SelectItem>
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleNotificationToggle(tender.id)}
                    title="Get notifications"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
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
                  
                  <div className="pt-3 flex justify-between">
                    <Link to={`/supplier/tender-details/${tender.id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/supplier/prepare-bid/${tender.id}`}>
                      <Button size="sm">
                        Submit Bid
                      </Button>
                    </Link>
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
        </div>
      )}
    </div>
  );
};

export default TenderDiscovery;
