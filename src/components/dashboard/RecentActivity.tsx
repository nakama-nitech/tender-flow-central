
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Calendar } from 'lucide-react';
import ActivityItem from './ActivityItem';

const RecentActivity: React.FC = () => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates on your tenders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ActivityItem
            icon={FileText}
            title="New Tender Created"
            description="IT Infrastructure Upgrade"
            time="2 hours ago"
          />
          
          <ActivityItem
            icon={TrendingUp}
            title="Bid Submitted"
            description="Office Renovation Project"
            time="6 hours ago"
          />
          
          <ActivityItem
            icon={Calendar}
            title="Tender Deadline Approaching"
            description="Network Equipment Procurement"
            time="2 days remaining"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
