
import React from 'react';
import { format } from 'date-fns';
import { Calendar, DollarSign, Filter, Clock, Eye, Pencil, Draft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tender, TenderCategory } from '@/types/tender';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TenderCardProps {
  tender: Tender;
  onEdit: (id: string) => void;
  onViewBids: (id: string) => void;
}

// Helper function for category badges
const getCategoryBadge = (category: TenderCategory) => {
  const badges = {
    construction: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    services: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    goods: "bg-green-100 text-green-800 hover:bg-green-100",
    consulting: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    other: "bg-gray-100 text-gray-800 hover:bg-gray-100"
  };

  return <Badge className={badges[category]}>{category}</Badge>;
};

export const TenderCard: React.FC<TenderCardProps> = ({ tender, onEdit, onViewBids }) => {
  const { toast } = useToast();
  const deadline = new Date(tender.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 7;

  const handleStatusChange = async () => {
    const newStatus = tender.status === 'draft' ? 'published' : 'draft';
    
    try {
      const { error } = await supabase
        .from('tenders')
        .update({ status: newStatus })
        .eq('id', tender.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Tender has been ${newStatus === 'published' ? 'published' : 'moved to draft'}`,
      });

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tender status",
        variant: "destructive"
      });
    }
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tender.title}</CardTitle>
          <Badge 
            variant={tender.status === 'published' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={handleStatusChange}
          >
            {tender.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
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
              <span>Deadline: {format(deadline, 'MMM d, yyyy')}</span>
              <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                {daysLeft} days left
              </span>
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
            <span className="text-sm">Posted: {format(new Date(tender.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(tender.id)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        {tender.status === 'published' && (
          <Button 
            size="sm" 
            variant="default" 
            className="flex-1"
            onClick={() => onViewBids(tender.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Bids
          </Button>
        )}
        <Button
          size="sm"
          variant={tender.status === 'draft' ? 'success' : 'secondary'}
          className="flex-1"
          onClick={handleStatusChange}
        >
          {tender.status === 'draft' ? (
            <>
              <Send className="h-4 w-4 mr-2" />
              Publish
            </>
          ) : (
            <>
              <Draft className="h-4 w-4 mr-2" />
              To Draft
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
