import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useItemsStore } from '../store/itemsStore';
import { useJobsStore } from '../store/jobsStore';
import Card, { CardHeader, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ChevronLeft, ChevronRight, Video, RefreshCw, Check, X } from 'lucide-react';
import { Job, Photo } from '../types';

const VideoGenPage: React.FC = () => {
  const [, params] = useRoute('/video-gen/:id');
  const [, navigate] = useLocation();
  const itemId = params?.id;
  
  const { getItemById } = useItemsStore();
  const { jobs, getJobsByItemIdAndType, addJob, isLoading } = useJobsStore();
  
  const [step, setStep] = useState(1);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  
  const item = itemId ? getItemById(itemId) : undefined;
  const photoJobs = itemId ? getJobsByItemIdAndType(itemId, 'photo') : [];
  const videoJobs = itemId ? getJobsByItemIdAndType(itemId, 'video') : [];
  
  // Get completed photo jobs with URLs
  const completedPhotoJobs = photoJobs.filter(job => job.url);
  
  // Handle navigation
  useEffect(() => {
    if (!item) {
      navigate('/');
    }
  }, [item, navigate]);
  
  // Initialize descriptions when photo jobs change
  useEffect(() => {
    const newDescriptions: Record<string, string> = {};
    completedPhotoJobs.forEach(job => {
      newDescriptions[job.id] = `Generate a 360° view of this ${item?.type} with smooth rotation and professional lighting`;
    });
    setDescriptions(newDescriptions);
  }, [completedPhotoJobs, item]);
  
  if (!item) {
    return <div>Loading...</div>;
  }
  
  const togglePhotoSelection = (jobId: string) => {
    if (selectedPhotos.includes(jobId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== jobId));
    } else {
      setSelectedPhotos([...selectedPhotos, jobId]);
    }
  };
  
  const handleDescriptionChange = (jobId: string, description: string) => {
    setDescriptions({
      ...descriptions,
      [jobId]: description
    });
  };
  
  const handleSubmit = async () => {
    for (const jobId of selectedPhotos) {
      const photoJob = photoJobs.find(job => job.id === jobId);
      if (photoJob && photoJob.url) {
        await addJob({
          type: 'video',
          itemId: item.id,
          originalImage: photoJob.url,
          submitDate: new Date().toISOString(),
          prompt: descriptions[jobId],
          submitee: 'admin',
          meta: { sourcePhotoJobId: jobId }
        });
      }
    }
    setStep(2);
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
        <h1 className="text-2xl font-bold text-gray-900">Video Generator</h1>
      </div>
      
      {/* Wizard Steps */}
      <div className="flex justify-center mb-8">
        <div className="w-2/3">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-grow h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-sm font-medium text-gray-500">Select Photos</div>
            <div className="text-sm font-medium text-gray-500">Generated Videos</div>
          </div>
        </div>
      </div>
      
      {step === 1 ? (
        <Card>
          <CardHeader 
            title="Select Photos for Video Generation" 
            description="Choose photos and add descriptions for video generation."
          />
          
          {completedPhotoJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos available</h3>
              <p className="text-sm text-gray-500 mb-4">Generate photos first before creating videos.</p>
              <Button variant="primary" onClick={() => navigate(`/photo-gen/${item.id}`)}>
                Generate Photos
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Available Photos</h3>
                  <p className="text-sm text-gray-500">Select photos and customize video descriptions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="primary">
                    {selectedPhotos.length} selected
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPhotos(completedPhotoJobs.map(job => job.id))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPhotos([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {completedPhotoJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className={`border rounded-lg p-4 ${selectedPhotos.includes(job.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-1/4">
                        <div className="relative">
                          <img 
                            src={job.url || ''} 
                            alt={`Photo ${job.id}`}
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <button
                            onClick={() => togglePhotoSelection(job.id)}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedPhotos.includes(job.id) 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-500 border border-gray-300'
                            }`}
                          >
                            {selectedPhotos.includes(job.id) ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="w-3/4">
                        <textarea
                          rows={3}
                          className={`w-full border rounded-md p-2 ${
                            selectedPhotos.includes(job.id) 
                              ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500 bg-gray-50'
                          }`}
                          placeholder="Enter a description for the video"
                          value={descriptions[job.id] || ''}
                          onChange={(e) => handleDescriptionChange(job.id, e.target.value)}
                          disabled={!selectedPhotos.includes(job.id)}
                        />
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`text-xs ${!selectedPhotos.includes(job.id) && 'opacity-50'}`}
                            disabled={!selectedPhotos.includes(job.id)}
                            onClick={() => {
                              handleDescriptionChange(
                                job.id, 
                                `Generate a 360° view of this ${item.type} with smooth rotation and professional lighting`
                              );
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reset to Default
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => navigate('/')} className="mr-2">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={selectedPhotos.length === 0}
            >
              Generate Videos
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader 
            title="Generated Videos" 
            description="Review the AI-generated videos for your item."
          />
          
          {videoJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos generated yet</h3>
              <p className="text-sm text-gray-500 mb-4">Return to the previous step to generate videos.</p>
              <Button variant="primary" onClick={() => setStep(1)}>
                Select Photos
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Generated Videos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {videoJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="relative h-64 bg-gray-100">
                      {job.url ? (
                        <div className="w-full h-full flex items-center justify-center">
                          {/* This would be a video player in a real app */}
                          <div className="bg-black w-full h-full flex items-center justify-center">
                            <Video className="h-12 w-12 text-white opacity-70" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="animate-pulse">
                            <RefreshCw className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Video {job.id}</div>
                      <div className="text-xs text-gray-500">{new Date(job.submitDate).toLocaleString()}</div>
                      <div className="mt-2 text-xs text-gray-600 line-clamp-3">{job.prompt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-1 h-5 w-5" />
              Back to Photos
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              Finish
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const Plus: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default VideoGenPage;