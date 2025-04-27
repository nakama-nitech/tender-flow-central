
import React from 'react';
import { useTenderDiscovery } from '@/hooks/tender/useTenderDiscovery';
import { StatsGrid } from '@/components/supplier/dashboard/StatsGrid';
import { NotificationsCard } from '@/components/supplier/dashboard/NotificationsCard';
import { NewTendersCard } from '@/components/supplier/dashboard/NewTendersCard';
import { UpcomingDeadlinesCard } from '@/components/supplier/dashboard/UpcomingDeadlinesCard';
import { ActiveBidsCard } from '@/components/supplier/dashboard/ActiveBidsCard';

const SupplierDashboard: React.FC = () => {
  const { filteredTenders } = useTenderDiscovery();
  
  // Filter new tenders (added in the last 7 days)
  const newTenders = filteredTenders
    .filter(tender => {
      const tenderDate = new Date(tender.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return tenderDate >= sevenDaysAgo;
    })
    .slice(0, 3); // Show only the 3 most recent

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supplier Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, ABC Construction Ltd
        </p>
      </div>
      
      <StatsGrid />
      <NotificationsCard />
      
      <div className="grid gap-6 md:grid-cols-3">
        <NewTendersCard tenders={newTenders} />
        <UpcomingDeadlinesCard />
        <ActiveBidsCard />
      </div>
    </div>
  );
};

export default SupplierDashboard;
