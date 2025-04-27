
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Tender } from '@/types/tender';
import { getCategoryBadge, formatCurrency } from '@/components/tender/utils/tenderUtils';

interface NewTendersCardProps {
  tenders: Tender[];
}

export const NewTendersCard: React.FC<NewTendersCardProps> = ({ tenders }) => {
  return (
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
        {tenders.map((tender) => (
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
  );
};
