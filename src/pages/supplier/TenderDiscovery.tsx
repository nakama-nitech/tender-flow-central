
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { TenderDiscoveryFilters } from '@/components/tender/list/TenderDiscoveryFilters';
import { TenderDiscoveryCard } from '@/components/tender/list/TenderDiscoveryCard';
import { useTenderDiscovery } from '@/hooks/tender/useTenderDiscovery';

const TenderDiscovery: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    toggleCategory,
    budgetRange,
    setBudgetRange,
    filteredTenders,
    loading,
    cart,
    handleNotificationToggle,
    addToCart,
  } = useTenderDiscovery();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discover Tenders</h2>
          <p className="text-muted-foreground">
            Find opportunities that match your business capabilities
          </p>
        </div>
        
        <Link to="/supplier/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </Button>
        </Link>
      </div>

      <TenderDiscoveryFilters
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        budgetRange={budgetRange}
        onSearchChange={setSearchTerm}
        onCategoryToggle={toggleCategory}
        onBudgetChange={setBudgetRange}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse border rounded-lg">
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTenders.map((tender) => (
            <TenderDiscoveryCard
              key={tender.id}
              tender={tender}
              onNotificationToggle={handleNotificationToggle}
              onAddToCart={addToCart}
              isInCart={cart.includes(tender.id)}
            />
          ))}
        </div>
      )}
      
      {!loading && filteredTenders.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No tenders found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default TenderDiscovery;
