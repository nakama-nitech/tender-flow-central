
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';

export const UpcomingDeadlinesCard = () => {
  return (
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
  );
};
