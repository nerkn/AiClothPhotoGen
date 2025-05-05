import { useState } from 'react';

interface MediaViewerProps {
  url: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isVideo = url.toLowerCase().endsWith('.mp4');

  const toggleViewer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Button to open/close the viewer */}
      <button
        onClick={toggleViewer}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {isOpen ? 'Close Viewer' : 'Open Viewer'}
      </button>

      {/* Modal/Viewer overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={toggleViewer}>
          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">
                {isVideo ? 'Video Player' : 'Image Viewer'}
              </h3>
              <button 
                onClick={toggleViewer}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 flex justify-center">
              {isVideo ? (
                <video 
                  controls 
                  className="max-h-screen max-w-full"
                  autoPlay
                  loop
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={url} 
                  alt="Media content" 
                  className="max-h-screen max-w-full object-contain" 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 