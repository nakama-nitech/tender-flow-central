import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, Clock, ChevronRight, Calendar, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency, getCategoryBadge } from '@/components/tender/utils/tenderUtils';
import { useTenderDiscovery } from '@/hooks/tender/useTenderDiscovery';

const SupplierDashboard: React.FC = () => {
  const { tenders: allTenders } = useTenderDiscovery();
  
  // Filter new tenders (added in the last 7 days)
  const newTenders = allTenders.filter(tender => {
    const tenderDate = new Date(tender.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return tenderDate >= sevenDaysAgo;
  }).slice(0, 3); // Show only the 3 most recent

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supplier Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, ABC Construction Ltd
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tender Matches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 new matches</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next in 2 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38%</div>
            <p className="text-xs text-muted-foreground">+4% from last quarter</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest updates regarding your tender activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 border-b pb-4">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">New Tender Match</h4>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Office Building Renovation tender matches your company profile</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 border-b pb-4">
            <Bell className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Bid Status Update</h4>
              </div>
              <p className="text-sm text-muted-foreground">Your bid for IT Infrastructure Upgrade has been shortlisted</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Clarification Response</h4>
              </div>
              <p className="text-sm text-muted-foreground">Your question about the Annual Financial Audit tender has been answered</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Deadlines + My Active Bids + New Tenders */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* New Tenders Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>New Tenders</span>
              <Link to="/supplier/tenders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>Recently published opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {newTenders.map((tender) => (
              <div key={tender.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{tender.title}</h4>
                  {getCategoryBadge(tender.category)}
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {tender.description}
                </p>
                <div className="text-xs flex justify-between">
                  <span>{formatCurrency(tender.budget)}</span>
                  <Link to={`/supplier/tender-details/${tender.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      View details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Deadlines</span>
              <Link to="/supplier/tenders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>Tenders closing soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">IT Infrastructure Upgrade</h4>
                <div className="text-xs font-medium rounded-full px-2 py-0.5 bg-red-100 text-red-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  2 days left
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                Supply and installation of network equipment, servers, and workstations
              </p>
              <div className="text-xs flex justify-between">
                <span>Budget: $250,000</span>
                <Link to="/supplier/tender-details/2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    View details
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">Annual Financial Audit</h4>
                <div className="text-xs font-medium rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  5 days left
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                Professional services for annual financial audit and compliance review
              </p>
              <div className="text-xs flex justify-between">
                <span>Budget: $45,000</span>
                <Link to="/supplier/tender-details/3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    View details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* My Active Bids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Active Bids</span>
              <Link to="/supplier/my-bids">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>Track your submitted proposals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">Office Building Renovation</h4>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Submitted</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                Complete renovation of a 3-story office building
              </p>
              <div className="text-xs flex justify-between mt-2">
                <span>Submitted: Apr 5, 2025</span>
                <Link to="/supplier/bid-status/1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Track status
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">IT Infrastructure Upgrade</h4>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shortlisted</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                Supply and installation of network equipment
              </p>
              <div className="text-xs flex justify-between mt-2">
                <span>Submitted: Mar 28, 2025</span>
                <Link to="/supplier/bid-status/2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Track status
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
