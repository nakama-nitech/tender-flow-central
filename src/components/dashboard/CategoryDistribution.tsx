
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryProgress from './CategoryProgress';

const CategoryDistribution: React.FC = () => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>
          Tenders by category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CategoryProgress 
          name="Construction" 
          percentage={38} 
          color="bg-primary"
        />
        
        <CategoryProgress 
          name="Services" 
          percentage={28} 
          color="bg-blue-400"
        />
        
        <CategoryProgress 
          name="Goods" 
          percentage={22} 
          color="bg-green-400"
        />
        
        <CategoryProgress 
          name="Consulting" 
          percentage={12} 
          color="bg-amber-400"
        />
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
