
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, Trash2, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TenderCategory, Tender } from '@/types/tender';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

// Mock cart data for now - in a real app this would be stored in state or context
const mockCart: string[] = [];

const Cart: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth('supplier');
  const [cart, setCart] = useState<string[]>(mockCart);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [bids, setBids] = useState<Record<string, { amount: number; notes: string }>>({});

  // Fetch tenders based on cart IDs
  useEffect(() => {
    const fetchTenders = async () => {
      if (cart.length === 0) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tenders')
          .select('*')
          .in('id', cart);
          
        if (error) {
          console.error('Error fetching tenders:', error);
          return;
        }
        
        if (data) {
          setTenders(data);
          // Initialize bid amounts based on tender budget
          const initialBids: Record<string, { amount: number; notes: string }> = {};
          data.forEach(tender => {
            initialBids[tender.id] = { 
              amount: Math.floor(tender.budget * 0.95), // Default bid at 95% of budget
              notes: ""
            };
          });
          setBids(initialBids);
        }
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, [cart]);

  const handleRemoveFromCart = (tenderId: string) => {
    setCart(prev => prev.filter(id => id !== tenderId));
    toast({
      title: "Removed from cart",
      description: "Tender has been removed from your cart",
    });
  };

  const handleBidAmountChange = (tenderId: string, amount: string) => {
    const numericAmount = parseFloat(amount) || 0;
    setBids(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        amount: numericAmount
      }
    }));
  };

  const handleBidNotesChange = (tenderId: string, notes: string) => {
    setBids(prev => ({
      ...prev,
      [tenderId]: {
        ...prev[tenderId],
        notes
      }
    }));
  };

  const handleSubmitBids = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit bids",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Process each bid in the cart
      for (const tender of tenders) {
        const bidData = bids[tender.id];
        
        if (!bidData) continue;
        
        // Create bid in database
        const { error } = await supabase
          .from('bids')
          .insert({
            tenderid: tender.id,
            vendor_id: user.id,
            vendoremail: user.email,
            vendorname: user.email?.split('@')[0] || 'Supplier',
            amount: bidData.amount,
            notes: bidData.notes,
            status: 'pending',
            proposal: `Bid submitted via ${paymentMethod}`,
          });
          
        if (error) {
          console.error('Error submitting bid:', error);
          toast({
            title: "Error submitting bid",
            description: error.message,
            variant: "destructive"
          });
          setSubmitting(false);
          return;
        }
      }
      
      toast({
        title: "Bids submitted successfully!",
        description: "Your bids have been submitted for review",
        variant: "success"
      });
      
      // Clear cart and redirect to bid status page
      setCart([]);
      navigate('/supplier/my-bids');
      
    } catch (error: any) {
      console.error('Error in bid submission:', error);
      toast({
        title: "Submission error",
        description: error.message || "An error occurred during submission",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadge = (category: TenderCategory) => {
    switch (category) {
      case 'construction':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{category}</Badge>;
      case 'services':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
      case 'goods':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
      case 'consulting':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
      case 'other':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/supplier/tenders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tenders
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Your Cart</h2>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/supplier/tenders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tenders
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Your Cart</h2>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center mb-6">
              <p className="text-lg mb-2">Your cart is empty</p>
              <p>Add tenders to your cart to start bidding</p>
            </div>
            <Link to="/supplier/tenders">
              <Button>
                Browse Tenders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/supplier/tenders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenders
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Your Cart</h2>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {tenders.map((tender) => (
            <Card key={tender.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span>{tender.title}</span>
                  {getCategoryBadge(tender.category)}
                </CardTitle>
                <CardDescription className="flex justify-between">
                  <span>Deadline: {formatDate(tender.deadline)}</span>
                  <span>Budget: {formatCurrency(tender.budget)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Bid Amount</label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="Enter your bid amount"
                      value={bids[tender.id]?.amount || ''}
                      onChange={(e) => handleBidAmountChange(tender.id, e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea
                    className="mt-1"
                    placeholder="Add any notes about your bid..."
                    value={bids[tender.id]?.notes || ''}
                    onChange={(e) => handleBidNotesChange(tender.id, e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveFromCart(tender.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Complete your bid submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {tenders.map((tender) => (
                  <div key={tender.id} className="flex justify-between text-sm">
                    <span className="truncate max-w-[180px]">{tender.title}</span>
                    <span>{formatCurrency(bids[tender.id]?.amount || 0)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total Bids</span>
                <span>{tenders.length}</span>
              </div>
              
              <div className="pt-4">
                <label className="text-sm font-medium block mb-2">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubmitBids}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit All Bids
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
