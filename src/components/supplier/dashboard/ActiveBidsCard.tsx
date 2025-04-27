
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

export const ActiveBidsCard = () => {
  return (
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
  );
};
