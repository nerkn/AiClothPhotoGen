import { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, Save, X } from 'lucide-react'; 
import { Item } from '../../types';
import { useJobsStore } from '../../store/jobsStore';
import { useItemsStore } from '../../store/itemsStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const CombineCreate: React.FC = () => {
  const [, setLocation] = useLocation();
  const { addJob } = useJobsStore();
  const { items } = useItemsStore();
  
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [prompt, setPrompt] = useState('');
  
  // Selected items for each category
  const [selectedItems, setSelectedItems] = useState<{
    head: Item[];
    top: Item[];
    bottom: Item[];
    shoe: Item[];
    bag: Item[];
  }>({
    head: [],
    top: [],
    bottom: [],
    shoe: [],
    bag: []
  });
  
  // Item selection modal state
  const [showSelector, setShowSelector] = useState<keyof typeof selectedItems | null>(null);
  
  const handleAddItem = (category: keyof typeof selectedItems, item: Item) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };
  
  const handleRemoveItem = (category: keyof typeof selectedItems, itemId: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
  };
  
  const generateJobItems = () => {
    const combinations: Array<{
      itemHead: number;
      itemTop: number;
      itemBottom: number;
      itemShoe: number;
      itemBag: number;
    }> = [];
    
    // Generate all possible combinations
    for (const head of selectedItems.head.length ? selectedItems.head : [{ id: 0 }]) {
      for (const top of selectedItems.top.length ? selectedItems.top : [{ id: 0 }]) {
        for (const bottom of selectedItems.bottom.length ? selectedItems.bottom : [{ id: 0 }]) {
          for (const shoe of selectedItems.shoe.length ? selectedItems.shoe : [{ id: 0 }]) {
            for (const bag of selectedItems.bag.length ? selectedItems.bag : [{ id: 0 }]) {
              combinations.push({
                itemHead: head.id,
                itemTop: top.id,
                itemBottom: bottom.id,
                itemShoe: shoe.id,
                itemBag: bag.id
              });
            }
          }
        }
      }
    }
    
    return combinations;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !desc || !prompt) {
      alert('Please fill in all required fields');
      return;
    }
    
    const jobItems = generateJobItems();
    
    if (jobItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    
    try {
      await addJob({  
        prompt,
        status: 'pending',
        items: jobItems
      });
      
      setLocation('/jobs');
    } catch (error) {
      alert('Failed to create job');
    }
  };
  
  const renderItemSelector = (category: keyof typeof selectedItems) => {
    const availableItems = items.filter(item => !selectedItems[category].find(selected => selected.id === item.id));
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Select {category.charAt(0).toUpperCase() + category.slice(1)} Items</h3>
            <button
              onClick={() => setShowSelector(null)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {availableItems.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  handleAddItem(category, item);
                  setShowSelector(null);
                }}
                className="cursor-pointer group"
              >
                <Card className="overflow-hidden h-full group-hover:ring-2 group-hover:ring-primary-500">
                  <div 
                    className="h-32 bg-center bg-cover" 
                    style={{ backgroundImage: `url(${item.img??item.img2})` }}
                  />
                  <div className="p-2">
                    <p className="font-medium text-sm">{item.name}</p>
                    <span className="text-xs text-neutral-500">{item.type}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Create New Job</h1>
          <p className="text-neutral-500">Create a new styling job with item combinations</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Job Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-colors"
                  placeholder="Enter job name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-colors"
                  placeholder="Enter job description"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Styling Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-colors"
                  placeholder="Enter styling prompt"
                  rows={3}
                  required
                />
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Item Selection</h2>
            
            <div className="space-y-6">
              {(Object.keys(selectedItems) as Array<keyof typeof selectedItems>).map(category => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      {category.charAt(0).toUpperCase() + category.slice(1)} Items
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSelector(category)} 
                    ><Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                  
                  {selectedItems[category].length === 0 ? (
                    <p className="text-sm text-neutral-500 italic">No items selected</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {selectedItems[category].map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <div 
                            className="h-24 bg-center bg-cover" 
                            style={{ backgroundImage: `url(${item.img??item.img2})` }}
                          />
                          <div className="p-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <span className="text-xs text-neutral-500">{item.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(category, item.id)}
                                className="text-neutral-400 hover:text-error-600 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/jobs')}
            >
              Cancel
            </Button>
            <Button
              type="submit" 
              
            ><Save className="h-4 w-4" />
              Create Job
            </Button>
          </div>
        </div>
      </form>
      
      {showSelector && renderItemSelector(showSelector)}
    </div>
  );
};
