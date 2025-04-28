import { create } from 'zustand';
import { Item, ItemType } from '../types';

// Sample initial data for testing
const initialItems: Item[] = [
  {
    id: '1',
    link: '#',
    img: 'https://images.pexels.com/photos/6347548/pexels-photo-6347548.jpeg?auto=compress&cs=tinysrgb&w=500',
    img2: 'https://images.pexels.com/photos/6347548/pexels-photo-6347548.jpeg?auto=compress&cs=tinysrgb&w=500',
    type: 'shirt',
    name: 'Klasik Beyaz Gömlek',
    price: 39.99,
    barcode: 'SHT12345',
    aiPhotos: [],
    aiVideos: [],
    stories: [],
  },
  {
    id: '2',
    link: '#',
    img: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500',
    img2: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500',
    type: 'trousers',
    name: 'Mavi Kot Pantolon',
    price: 59.99,
    barcode: 'TRS67890',
    aiPhotos: [],
    aiVideos: [],
    stories: [],
  },
  {
    id: '3',
    link: '#',
    img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    img2: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    type: 'shoes',
    name: 'Spor Ayakkabı',
    price: 89.99,
    barcode: 'SHO24680',
    aiPhotos: [],
    aiVideos: [],
    stories: [],
  }
];

export interface ItemsState {
  items: Item[];
  selectedItemId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<Item, 'id'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  selectItem: (id: string | null) => void;
  getItemById: (id: string) => Item | undefined;
  getItemsByType: (type: ItemType) => Item[];
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: initialItems,
  selectedItemId: null,
  isLoading: false,
  error: null,
  
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would fetch from an API
      // Simulating API fetch with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ items: initialItems, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch items', 
        isLoading: false 
      });
    }
  },
  
  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem = { 
        ...item, 
        id: Math.random().toString(36).substring(2, 9),
        aiPhotos: [],
        aiVideos: [],
        stories: []
      } as Item;
      
      set(state => ({ 
        items: [...state.items, newItem],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add item', 
        isLoading: false 
      });
    }
  },
  
  updateItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update item', 
        isLoading: false 
      });
    }
  },
  
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete item', 
        isLoading: false 
      });
    }
  },
  
  selectItem: (id) => {
    set({ selectedItemId: id });
  },
  
  getItemById: (id) => {
    return get().items.find(item => item.id === id);
  },
  
  getItemsByType: (type) => {
    return get().items.filter(item => item.type === type);
  }
}));