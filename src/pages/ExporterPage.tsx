import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useItemsStore } from '../store/itemsStore';
import Card, { CardHeader, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { ChevronLeft, Upload, Check, AlertCircle } from 'lucide-react';

type ExportTarget = 'erp' | 'ecommerce' | 'operational' | 'stakeholders';

interface ExportOption {
  id: ExportTarget;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const ExporterPage: React.FC = () => {
  const [, params] = useRoute('/exporter/:id');
  const [, navigate] = useLocation();
  const itemId = params?.id ? parseInt(params.id, 10) : undefined;
  
  const { getItemById, updateItem } = useItemsStore();
  
  const [selectedTargets, setSelectedTargets] = useState<ExportTarget[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  
  const item = itemId ? getItemById(itemId) : undefined;
  
  // Handle navigation
  useEffect(() => {
    if (!item) {
      navigate('/');
    }
  }, [item, navigate]);
  
  if (!item) {
    return <div>Loading...</div>;
  }
  
  const exportOptions: ExportOption[] = [
    {
      id: 'erp',
      name: 'ERP System',
      description: 'Export item details and content to your ERP system',
      icon: <ERPIcon className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Platform',
      description: 'Publish to your online store with all media assets',
      icon: <ECommerceIcon className="h-8 w-8 text-purple-600" />
    },
    {
      id: 'operational',
      name: 'Operational Advisor',
      description: 'Send to operational teams for review and implementation',
      icon: <OperationalIcon className="h-8 w-8 text-emerald-600" />
    },
    {
      id: 'stakeholders',
      name: 'Stakeholder Approval',
      description: 'Share with stakeholders for final approval',
      icon: <StakeholderIcon className="h-8 w-8 text-amber-600" />
    }
  ];
  
  const toggleTarget = (target: ExportTarget) => {
    if (selectedTargets.includes(target)) {
      setSelectedTargets(selectedTargets.filter(t => t !== target));
    } else {
      setSelectedTargets([...selectedTargets, target]);
    }
  };
  
  const handleExport = async () => {
    if (selectedTargets.length === 0) return;
    
    setIsExporting(true);
    
    // Initialize all selected targets as pending
    const initialStatus: Record<string, 'success' | 'error' | 'pending'> = {};
    selectedTargets.forEach(target => {
      initialStatus[target] = 'pending';
    });
    setExportStatus(initialStatus);
    
    // Simulate export process with artificial delays
    for (const target of selectedTargets) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Randomly succeed or fail for demo purposes
      const status = Math.random() > 0.2 ? 'success' : 'error';
      
      setExportStatus(prev => ({
        ...prev,
        [target]: status
      }));
    }
    
    // Update item with export date if at least one export was successful
    const hasSuccessfulExport = Object.values(exportStatus).some(status => status === 'success');
    if (hasSuccessfulExport) {
      await updateItem(item.id, {
        // In a real app, this would track which targets were successfully exported
        // and when they were exported
      });
    }
    
    setIsExporting(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/')}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Aktarım Ekranı</h1>
      </div>
      
      <Card>
        <CardHeader 
          title="Export Manager" 
          description="Export your item and its generated content to various platforms."
        />
        
        <div className="flex gap-6 mb-6">
          <div className="w-1/3">
            <div className="bg-gray-100 p-4 rounded-lg">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-auto rounded-md object-cover mb-4"
              />
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 capitalize">Tip: {item.type}</p>
              <p className="text-sm text-gray-500">Barcode: {item.barcode}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">İçerik Özeti</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Fotolar:</span>
                    <span className="font-medium">{item?.aiPhotos?.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Videolar:</span>
                    <span className="font-medium">{item?.aiVideos?.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storyler:</span>
                    <span className="font-medium">{item?.stories?.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-2/3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Aktarım </h3>
            
            <div className="space-y-3">
              {exportOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTargets.includes(option.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleTarget(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        {exportStatus[option.id] && (
                          <ExportStatusBadge status={exportStatus[option.id]} />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedTargets.includes(option.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {selectedTargets.includes(option.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => navigate('/')} className="mr-2">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            isLoading={isExporting}
            disabled={selectedTargets.length === 0 || isExporting}
          >
            <Upload className="mr-1 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Content'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Custom export-specific components

const ExportStatusBadge: React.FC<{ status: 'success' | 'error' | 'pending' }> = ({ status }) => {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Check className="h-3 w-3 mr-1" />
        Aktarıldı
      </span>
    );
  }
  
  if (status === 'error') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <AlertCircle className="h-3 w-3 mr-1" />
        Olmadı
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      <div className="animate-spin h-3 w-3 mr-1 border-2 border-blue-600 border-t-transparent rounded-full" />
      İşleniyor
    </span>
  );
};

// Custom icons for export targets
const ERPIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2" />
    <line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="21" x2="15" y2="9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ECommerceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L5.8 15H17M17 17H7M7 17C5.89543 17 5 17.8954 5 19C5 20.1046 5.89543 21 7 21C8.10457 21 9 20.1046 9 19C9 17.8954 8.10457 17 7 17ZM17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OperationalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M12 4L8 8M12 4L16 8M4 12H20M4 12L8 16M4 12L8 8M20 12L16 16M20 12L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StakeholderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13M16 3.13C17.7699 3.58317 19.0078 5.17797 19.0078 7.005C19.0078 8.83203 17.7699 10.4268 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ExporterPage;