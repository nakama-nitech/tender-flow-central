
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock } from 'lucide-react';

export const NotificationsCard = () => {
  return (
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
  );
};
