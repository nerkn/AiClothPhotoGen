import DataGrid from '../components/DataGrid/DataGrid';
import { useItemsStore } from '../store/itemsStore';
import { useJobsStore } from '../store/jobsStore';

export const HomePage  = () => {
  const { items, isLoading } = useItemsStore();
  const { jobs } = useJobsStore();
  let itemsWithJobs = items.map(item => {
    const aiPhotos = jobs.filter(job => job.itemId === item.id && job.type === 'photo');
    const aiVideos = jobs.filter(job => job.itemId === item.id && job.type === 'video');
    const stories = jobs.filter(job => job.itemId === item.id && job.type === 'story');
    return {...item, aiPhotos, aiVideos, stories };
  });

    
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İçerik Paneli</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ürünleri ve içerikleri yönetin
        </p>
      </div>
      
      <DataGrid items={itemsWithJobs} isLoading={isLoading} />
    </div>
  );
};
