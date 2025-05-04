import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useItemsStore } from '../store/itemsStore';
import { useJobsStore } from '../store/jobsStore';
import Card, { CardHeader, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { ChevronLeft, BookText, Copy, Check } from 'lucide-react';

const StoryGenPage: React.FC = () => {
  const [, params] = useRoute('/story-gen/:id');
  const [, navigate] = useLocation();
  const itemId = params?.id ? parseInt(params.id, 10) : undefined;
  
  const { getItemById } = useItemsStore();
  const { getJobsByItemIdAndType, addJob, isLoading } = useJobsStore();
  
  const [storyPrompt, setStoryPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  
  const item = itemId ? getItemById(itemId) : undefined;
  const storyJobs = itemId ? getJobsByItemIdAndType(itemId, 'story') : [];
  
  // Default prompt based on item type
  useEffect(() => {
    if (item) {
      setStoryPrompt(`"${item.name}" adlı ${item.type} için etkileyici bir ürün açıklaması yaz. Ürünün özelliklerini, tasarımını ve sunduğu avantajları vurgula. Açıklama, potansiyel müşterilere hitap edecek şekilde hem bilgilendirici hem de ilgi çekici ve ikna edici olsun.`);
    }
  }, [item]);
  
  // Handle navigation
  useEffect(() => {
    if (!item) {
      navigate('/');
    }
  }, [item, navigate]);
  
  if (!item) {
    return <div>Loading...</div>;
  }
  
  const handleGenerateStory = async () => {
    if (storyPrompt.trim()) {
      await addJob({
        type: 'story',
        itemId: item.id,
        submitDate: new Date().toISOString(),
        prompt: storyPrompt,
        submitee: 'admin',
        meta: {}
      });
    }
  };
  
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Sample generated story content for display purposes
  const sampleStory = `
${item.name} ile tanışın – şıklık ve konforu bir araya getiren özel bir parça.

Kaliteli malzemeler ve özenli işçilikle üretilen bu ${item.type}, özgün tasarım detayları ve çok yönlü kullanımıyla öne çıkıyor. Özenle seçilen kumaşı, hem dayanıklılığı hem de cildinize yumuşak ve lüks bir his sunmasıyla dikkat çekiyor.

Günlük kullanımda da özel davetlerde de rahatlıkla tercih edebileceğiniz ${item.name}, zarif silueti ve ince düşünülmüş detaylarıyla her kombini bir üst seviyeye taşıyor. Her dikişi büyük bir titizlikle yapılmış olan bu ürün, sadece şık görünmekle kalmıyor, aynı zamanda uzun ömürlü kullanım vadediyor.

Çok yönlü tasarımı sayesinde dolabınızdaki pek çok parça ile kolayca kombinlenebilen ${item.type}, gardırobunuzun vazgeçilmezlerinden biri olmaya aday. İster şık bir davet için ister günlük şıklığınız için tercih edin, ${item.name} her zaman favoriniz olacak.

Kalite ve şıklığın mükemmel uyumunu ${item.name} ile keşfedin – her detayında farkı hissedin.
  `;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/')}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Story Generator</h1>
      </div>
      
      <Card>
        <CardHeader 
          title="Generate Product Story" 
          description="Create compelling product descriptions and stories for your item."
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
          
          <div className="w-2/3 space-y-4">
            <div>
              <label htmlFor="story-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Story Prompt
              </label>
              <textarea
                id="story-prompt"
                rows={4}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                placeholder="Bir ürün hikayesi oluşturmak için bir komut (prompt) girin. "
              />
            </div>
            
            <div className="flex">
              <Button 
                variant="primary" 
                onClick={handleGenerateStory}
                isLoading={isLoading}
                disabled={!storyPrompt.trim()}
              >
                Story Yarat
              </Button>
            </div>
            
            {(storyJobs.length > 0 || true) && ( // Always show for demo purposes
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3"> Story Yarat</h3>
                <div className="relative">
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="prose prose-sm max-w-none">
                      {storyJobs.length > 0 ? (
                        <p>{storyJobs[0].prompt}</p> // In a real app, this would be the generated story content
                      ) : (
                        <p className="whitespace-pre-line">{sampleStory}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyText(sampleStory)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => navigate('/')} className="mr-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate('/')}>
            Save & Finish
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoryGenPage;