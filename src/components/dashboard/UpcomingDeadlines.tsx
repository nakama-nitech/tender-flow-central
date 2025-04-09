
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DeadlineItem from './DeadlineItem';

const UpcomingDeadlines: React.FC = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>
          Tenders closing soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DeadlineItem
            title="IT Security Audit"
            category="Services"
            budget="$75,000"
            daysRemaining={3}
          />
          
          <DeadlineItem
            title="Office Furniture"
            category="Goods"
            budget="$42,000"
            daysRemaining={7}
          />
          
          <DeadlineItem
            title="Network Equipment"
            category="Goods"
            budget="$128,000"
            daysRemaining={12}
          />
          
          <DeadlineItem
            title="Building Renovation"
            category="Construction"
            budget="$350,000"
            daysRemaining={15}
          />
        </div>
      </CardContent>
      <CardFooter>
        <a href="#" className="text-sm text-primary hover:underline">View all tenders</a>
      </CardFooter>
    </Card>
  );
};

export default UpcomingDeadlines;
