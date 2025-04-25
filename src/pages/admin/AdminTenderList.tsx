
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TenderCategory, TenderStatus, Tender } from '@/types/tender';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { TenderListHeader } from '@/components/admin/tenders/TenderListHeader';
import { TenderFilters } from '@/components/admin/tenders/TenderFilters';
import { TenderCard } from '@/components/admin/tenders/TenderCard';
import { EmptyTenderState } from '@/components/admin/tenders/EmptyTenderState';
import { LoadingState } from '@/components/admin/tenders/LoadingState';

const AdminTenderList: React.FC = () => {
  useAdminAuth(); // This ensures only admins can access this page
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<TenderCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch tenders from Supabase
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('tenders').select('*');
        
        if (error) throw error;
        
        // Map database fields to our interface
        const formattedTenders: Tender[] = data?.map(tender => ({
          ...tender,
          createdAt: tender.created_at,
          created_by: tender.created_by
        })) || [];
        
        setTenders(formattedTenders);
      } catch (err: any) {
        console.error('Error fetching tenders:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to load tenders',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTenders();
  }, [toast]);
  
  // Filter tenders based on search term and selected filters
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(tender.category);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      statusFilter === tender.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleNewTender = () => navigate('/admin/create-tender');
  const handleEditTender = (id: string) => navigate(`/admin/edit-tender/${id}`);
  const handleViewBids = (id: string) => navigate(`/admin/tender-bids/${id}`);
  const toggleCategory = (category: TenderCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <TenderListHeader onNewTender={handleNewTender} />
      
      <TenderFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {filteredTenders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTenders.map((tender) => (
                <TenderCard
                  key={tender.id}
                  tender={tender}
                  onEdit={handleEditTender}
                  onViewBids={handleViewBids}
                />
              ))}
            </div>
          ) : (
            <EmptyTenderState onNewTender={handleNewTender} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminTenderList;
