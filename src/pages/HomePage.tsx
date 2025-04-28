import React, { useEffect } from 'react';
import DataGrid from '../components/DataGrid/DataGrid';
import { useItemsStore } from '../store/itemsStore';

const HomePage: React.FC = () => {
  const { items, isLoading, fetchItems } = useItemsStore();
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İçerik Paneli</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ürünleri ve içerikleri yönetin
        </p>
      </div>
      
      <DataGrid items={items} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;