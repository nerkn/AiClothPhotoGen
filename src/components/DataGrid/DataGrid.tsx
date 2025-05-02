import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ChevronDown, ChevronUp, Search, Filter, Image, Video, BookText, Upload } from 'lucide-react';
import { Link } from 'wouter';
import { Item, AIWorkerStatus } from '../../types';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: Item) => React.ReactNode;
}

interface DataGridProps {
  items: Item[];
  isLoading?: boolean;
}

const getStatusBadge = (status: AIWorkerStatus) => {
  switch (status) {
    case 'notstarted':
      return <Badge variant="default">Başlamadı</Badge>;
    case 'working':
      return <Badge variant="primary">Çalışıyor</Badge>;
    case 'pending':
      return <Badge variant="warning">Beklemede</Badge>;
    case 'pushed':
      return <Badge variant="success">Gönderildi</Badge>;
    default:
      return null;
  }
};

// Get random AIWorkerStatus for demo purposes
const getRandomStatus = (): AIWorkerStatus => {
  const statuses: AIWorkerStatus[] = ['notstarted', 'working', 'pending', 'pushed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const DataGrid: React.FC<DataGridProps> = ({ items, isLoading = false }) => {
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  
  const columns: Column[] = [
    {
      key: 'name',
      title: 'İsmi',
      sortable: true,
      render: (item) => (
        <div className="flex items-center">
          <img 
            src={item.img} 
            alt={item.name} 
            className="h-10 w-10 rounded-md object-cover mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 text-ellipsis w-48 overflow-hidden">{item.name}</div>
            <div className="text-sm text-gray-500">{item.type}</div>
          </div>
        </div>
      )
    },
    {
      key: 'barcode',
      title: 'Barcode',
      sortable: true,
    },
    {
      key: 'type',
      title: 'Tipi',
      sortable: true,
      render: (item) => (
        <span className="capitalize">{item.type}</span>
      )
    },
    {
      key: 'photoCount',
      title: 'Fotolar',
      sortable: true,
      render: (item) => (
        <span>{item?.aiPhotos?.length}</span>
      )
    },
    {
      key: 'videoCount',
      title: 'Videolar',
      sortable: true,
      render: (item) => (
        <span>{item?.aiVideos?.length}</span>
      )
    },
    {
      key: 'storiesCount',
      title: 'Storyler',
      sortable: true,
      render: (item) => (
        <span>{item?.stories?.length}</span>
      )
    },
    {
      key: 'export',
      title: 'Aktarım',
      sortable: true,
      render: (_item) => (
        // This is just a placeholder for demo purposes
        Math.random() > 0.5 ? 
          <Badge variant="success">{new Date().toLocaleDateString()}</Badge> : 
          <Badge variant="default">Aktarılmadı</Badge>
      )
    },
    {
      key: 'aiworker',
      title: 'AI Durumu',
      render: () => getStatusBadge(getRandomStatus())
    },
    {
      key: 'actions',
      title: ' ',
      render: (item) => (
        <div className="flex space-x-2">
          <Link href={`/photo-gen/${item.id}`}>
            <a>
              <Button variant="outline" size="sm" className="p-1.5" title="Resim sihirbazı">
                <Image size={16} />
              </Button>
            </a>
          </Link>
          <Link href={`/video-gen/${item.id}`}>
            <a>
              <Button variant="outline" size="sm" className="p-1.5" title="Video sihirbazı">
                <Video size={16} />
              </Button>
            </a>
          </Link>
          <Link href={`/story-gen/${item.id}`}>
            <a>
              <Button variant="outline" size="sm" className="p-1.5"  title="Story sihirbazı">
                <BookText size={16} />
              </Button>
            </a>
          </Link>
          <Link href={`/exporter/${item.id}`}>
            <a>
              <Button variant="outline" size="sm" className="p-1.5"  title="Aktarım sihirbazı">
                <Upload size={16} />
              </Button>
            </a>
          </Link>
        </div>
      )
    }
  ];
  
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortKey as keyof Item];
    const bValue = b[sortKey as keyof Item];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle nested properties for counts
    if (sortKey === 'photoCount') {
      return sortDirection === 'asc'
        ? (a?.aiPhotos?.length||0) - (b?.aiPhotos?.length||0)
        : (b?.aiPhotos?.length||0) - (a?.aiPhotos?.length||0);
    }
    
    if (sortKey === 'videoCount') {
      return sortDirection === 'asc'
        ? (a?.aiVideos?.length||0) - (b?.aiVideos?.length||0)
        : (b?.aiVideos?.length||0) - (a?.aiVideos?.length||0);
    }
    
    if (sortKey === 'storiesCount') {
      return sortDirection === 'asc'
        ? (a?.stories?.length||0) - (b?.stories?.length||0)
        : (b?.stories?.length||0) - (a?.stories?.length||0);
    }
    
    return 0;
  });
  
  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ürün ara..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filitre
          </Button>
          
          <Button variant="primary">Ürün aktar</Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            ) : sortedItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item) 
                        : (item[column.key as keyof Item] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{sortedItems.length}</span> of{' '}
              <span className="font-medium">{items.length}</span> items
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataGrid;