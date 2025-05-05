export type ItemType = 'shirt' | 'trousers' | 'shoes' | 'hat' | 'scarf';

export type AIWorkerStatus = 'notstarted' | 'working' | 'pending' | 'pushed';

export interface Item {
  id: number;
  link: string;
  img: string;
  img2: string;
  type: ItemType;
  name: string;
  price: number;
  barcode: string;
  aiPhotos?: Photo[];
  aiVideos?: Video[];
  stories?: Story[];
}

export interface ItemTypePrompt {
  type: ItemType;
  prompt: string;
}

export interface Photo {
  id: string;
  itemId: string;
  url: string;
  type: 'ai' | 'integration' | 'upload';
  sort: number;
  deleted: boolean;
  ctime: string;
  meta: Record<string, any>;
}

export interface Video {
  id: string;
  itemId: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
  description?: string;
}

export interface Story {
  id: string;
  itemId: string;
  content: string;
  createdAt: string;
}

export type JobType = 'photo' | 'video' | 'story';

export interface Job {
  id: number;
  type: JobType;
  itemId: number;
  originalImage?: string;
  submitDate: string;
  createDate: string;
  url?: string;
  prompt: string;
  submitee: string;
  meta: Record<string, any>;
  status?: string;
}

export interface JobCombine {
  id: number;
  name: string;
  desc: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface JobCombineItem {
  id: number;
  jobId: number;
  itemHead: number;
  itemTop: number;
  itemBottom: number;
  itemShoe: number;
  itemBag: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output: string;
}