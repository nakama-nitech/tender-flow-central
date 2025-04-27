import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tender, TenderCategory } from '@/types/tender';
import { supabase } from '@/integrations/supabase/client';

export const useTenderDiscovery = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [budgetRange, setBudgetRange] = useState<string>('all');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tenders')
          .select('*')
          .eq('status', 'published');
          
        if (error) {
          console.error('Error fetching tenders:', error);
          toast({
            title: "Error loading tenders",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setTenders(data);
        }
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, [toast]);

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesBudget = 
      budgetRange === 'all' ||
      (budgetRange === 'low' && tender.budget <= 50000) ||
      (budgetRange === 'medium' && tender.budget > 50000 && tender.budget <= 250000) ||
      (budgetRange === 'high' && tender.budget > 250000);
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleNotificationToggle = (tenderId: string) => {
    toast({
      title: "Notification Settings Updated",
      description: "You will receive updates about this tender",
    });
  };

  const addToCart = (tenderId: string) => {
    if (cart.includes(tenderId)) {
      toast({
        title: "Already in cart",
        description: "This tender is already in your cart",
      });
      return;
    }
    
    setCart(prev => [...prev, tenderId]);
    toast({
      title: "Added to cart",
      description: "Tender has been added to your cart",
    });
  };

  const isInUserCart = (tenderId: string) => {
    return cart.includes(tenderId);
  };

  const removeFromCart = (tenderId: string) => {
    setCart(prev => prev.filter(id => id !== tenderId));
    toast({
      title: "Removed from cart",
      description: "Tender has been removed from your cart",
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    toggleCategory,
    budgetRange,
    setBudgetRange,
    filteredTenders,
    loading,
    cart,
    isInUserCart,
    removeFromCart,
    clearCart,
    handleNotificationToggle,
    addToCart,
  };
};
