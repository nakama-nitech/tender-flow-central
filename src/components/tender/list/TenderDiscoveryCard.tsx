
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Filter, FileText, Bell, ShoppingCart } from 'lucide-react';
import { Tender } from '@/types/tender';
import { getCategoryBadge, formatDate, formatCurrency } from '../utils/tenderUtils';
import { parseISO, isValid } from 'date-fns';

interface TenderDiscoveryCardProps {
  tender: Tender;
  onNotificationToggle: (tenderId: string) => void;
  onAddToCart: (tenderId: string) => void;
  isInCart: boolean;
}

export const TenderDiscoveryCard: React.FC<TenderDiscoveryCardProps> = ({
  tender,
  onNotificationToggle,
  onAddToCart,
  isInCart,
}) => {
  let daysLeft = 0;
  let isUrgent = false;
  
  try {
    const deadline = parseISO(tender.deadline);
    if (isValid(deadline)) {
      daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      isUrgent = daysLeft <= 7;
    }
  } catch (error) {
    console.error('Error calculating days left:', error);
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tender.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNotificationToggle(tender.id)}
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
              {daysLeft > 0 && (
                <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                  {daysLeft} days left
                </span>
              )}
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
            <span className="text-sm">
              Posted: {formatDate(tender.createdAt || tender.created_at)}
            </span>
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
              variant={isInCart ? "secondary" : "default"}
              onClick={() => onAddToCart(tender.id)}
              disabled={isInCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
