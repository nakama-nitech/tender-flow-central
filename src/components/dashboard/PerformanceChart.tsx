
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const PerformanceChart: React.FC = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Tender Performance</CardTitle>
        <CardDescription>
          Number of tenders and bids over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-muted-foreground text-center">
          <BarChart3 className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>Analytics chart would appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
