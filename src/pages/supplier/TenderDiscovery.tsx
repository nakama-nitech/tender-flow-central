
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, DollarSign, Clock, Bell, FileText, ShoppingCart } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';

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
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<string[]>([]);
  
  // Fetch tenders from the database
  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tenders')
          .select('*')
          .eq('status', 'published');
          
        if (error) {
          console.error('Error fetching tenders:', error);
          toast({
            title: "Error loading tenders",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setTenders(data);
        }
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, [toast]);
  
  // Filter tenders based on search term and selected filters
  const filteredTenders = tenders.filter((tender) => {
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

  const addToCart = (tenderId: string) => {
    if (cart.includes(tenderId)) {
      toast({
        title: "Already in cart",
        description: "This tender is already in your cart",
      });
      return;
    }
    
    setCart(prev => [...prev, tenderId]);
    toast({
      title: "Added to cart",
      description: "Tender has been added to your cart",
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discover Tenders</h2>
          <p className="text-muted-foreground">
            Find opportunities that match your business capabilities
          </p>
        </div>
        
        <Link to="/supplier/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </Button>
        </Link>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-72 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
                      <Button 
                        size="sm" 
                        variant={cart.includes(tender.id) ? "secondary" : "default"}
                        onClick={() => addToCart(tender.id)}
                        disabled={cart.includes(tender.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {cart.includes(tender.id) ? "Added" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {!loading && filteredTenders.length === 0 && (
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
