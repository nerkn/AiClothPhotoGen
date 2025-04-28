import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useItemsStore } from '../store/itemsStore';
import { usePromptsStore } from '../store/promptsStore';
import { useJobsStore } from '../store/jobsStore';
import Card, { CardHeader, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { ChevronLeft, ChevronRight, Image, RefreshCw } from 'lucide-react';

const PhotoGenPage: React.FC = () => {
  const [, params] = useRoute('/photo-gen/:id');
  const [, navigate] = useLocation();
  const itemId = params?.id;
  
  const { getItemById } = useItemsStore();
  const { prompts, getPromptByType } = usePromptsStore();
  const { jobs, getJobsByItemIdAndType, addJob, isLoading } = useJobsStore();
  
  const [step, setStep] = useState(1);
  const [customPrompts, setCustomPrompts] = useState<string[]>(Array(5).fill(''));
  
  const item = itemId ? getItemById(itemId) : undefined;
  const photoJobs = itemId ? getJobsByItemIdAndType(itemId, 'photo') : [];
  
  useEffect(() => {
    if (item && prompts.length > 0) {
      // Initialize with the item type prompt as a starting point
      const basePrompt = getPromptByType(item.type);
      setCustomPrompts(Array(5).fill(basePrompt));
    }
  }, [item, prompts, getPromptByType]);
  
  // Handle navigation
  useEffect(() => {
    if (!item) {
      navigate('/');
    }
  }, [item, navigate]);
  
  if (!item) {
    return <div>Loading...</div>;
  }
  
  const handleSubmitPrompts = async () => {
    for (let i = 0; i < customPrompts.length; i++) {
      if (customPrompts[i].trim()) {
        await addJob({
          type: 'photo',
          itemId: item.id,
          originalImage: item.img,
          submitDate: new Date().toISOString(),
          prompt: customPrompts[i],
          submitee: 'admin',
          meta: { promptIndex: i }
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
        <h1 className="text-2xl font-bold text-gray-900">Photo Generator</h1>
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
            <div className="text-sm font-medium text-gray-500">Promptları Ayarla</div>
            <div className="text-sm font-medium text-gray-500">Foto Üret</div>
          </div>
        </div>
      </div>
      
      {step === 1 ? (
        <Card>
          <CardHeader 
            title="AI Fotolar Üretin" 
            description={`Muhteşem  ${item.type} fotoğrafları üretin.`}
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
                <p className="text-sm text-gray-500 capitalize">Type: {item.type}</p>
                <p className="text-sm text-gray-500">Barcode: {item.barcode}</p>
              </div>
            </div>
            
            <div className="w-2/3">
              <h3 className="text-lg font-medium text-gray-900 mb-4"> Promptları Özelleştirin</h3>
              
              <div className="space-y-4">
                {customPrompts.map((prompt, index) => (
                  <div key={index}>
                    <label htmlFor={`prompt-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Prompt {index + 1}
                    </label>
                    <textarea
                      id={`prompt-${index}`}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={prompt}
                      onChange={(e) => {
                        const newPrompts = [...customPrompts];
                        newPrompts[index] = e.target.value;
                        setCustomPrompts(newPrompts);
                      }}
                      placeholder={`Enter a prompt for ${item.type} photo ${index + 1}`}
                    />
                  </div>
                ))}
                
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const basePrompt = getPromptByType(item.type);
                      setCustomPrompts(Array(5).fill(basePrompt));
                    }}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset Prompts
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => navigate('/')} className="mr-2">
              İptal
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitPrompts} 
              isLoading={isLoading}
              disabled={!customPrompts.some(p => p.trim())}
            >
              Fotolar üretin
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader 
            title="Üretilmiş Fotolar" 
            description="AI-üretilmiş fotoları burada eleyin."
          />
          
          {photoJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Daha foto üretilmemiş</h3>
              <p className="text-sm text-gray-500 mb-4">Önceki adımda foto ürettirebilirsiniz..</p>
              <Button variant="primary" onClick={() => setStep(1)}>
                Promptları düzenleyin
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Üretilmiş Fotolar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {photoJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="relative h-64 bg-gray-100">
                      {job.url ? (
                        <img 
                          src={job.url} 
                          alt={`Generated photo for ${item.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="animate-pulse">
                            <RefreshCw className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Foto {(job.meta.promptIndex as number) + 1}</div>
                      <div className="text-xs text-gray-500">{new Date(job.submitDate).toLocaleString()}</div>
                      <div className="mt-2 text-xs text-gray-600 line-clamp-2">{job.prompt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-1 h-5 w-5" />
              Back to Prompts
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              Bitiş
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PhotoGenPage;