import React from 'react';
import Navbar from './Navbar';
import { Link, useRoute } from 'wouter';
import { Box, Home, Image, Video, BookText, Upload } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isHomePage] = useRoute('/');
  const [isPhotoGenPage] = useRoute('/photo-gen/:id');
  const [isVideoGenPage] = useRoute('/video-gen/:id');
  const [isStoryGenPage] = useRoute('/story-gen/:id');
  const [isExporterPage] = useRoute('/exporter/:id');
  const [_, params] = useRoute('/:type/:id');
  let id = params?.id || 1;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Sidebar and main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 md:w-64 bg-white shadow-md">
          <div className="flex flex-col h-full py-4">
            <nav className="flex-1 px-2 space-y-1">
              <Link href="/">
                <a className={`flex items-center p-2 rounded-md transition-colors ${isHomePage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <Home className="h-5 w-5 mr-3" />
                  <span className="hidden md:inline">Panel</span>
                </a>
              </Link>
              
              {/* These would only be shown when an item is selected in a real app */}
              {(isPhotoGenPage || isVideoGenPage || isStoryGenPage || isExporterPage) && (
                <>
                  <Link href={`/photo-gen/${id ? id : '1'}`}>
                    <a className={`flex items-center p-2 rounded-md transition-colors ${isPhotoGenPage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Image className="h-5 w-5 mr-3" />
                      <span className="hidden md:inline">Foto Oluştur</span>
                    </a>
                  </Link>
                  
                  <Link href={`/video-gen/${id ? id : '1'}`}>
                    <a className={`flex items-center p-2 rounded-md transition-colors ${isVideoGenPage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Video className="h-5 w-5 mr-3" />
                      <span className="hidden md:inline">Video Oluştur</span>
                    </a>
                  </Link>
                  
                  <Link href={`/story-gen/${id ? id : '1'}`}>
                    <a className={`flex items-center p-2 rounded-md transition-colors ${isStoryGenPage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <BookText className="h-5 w-5 mr-3" />
                      <span className="hidden md:inline">Story Oluştur</span>
                    </a>
                  </Link>
                  
                  <Link href={`/exporter/${id ? id : '1'}`}>
                    <a className={`flex items-center p-2 rounded-md transition-colors ${isExporterPage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Upload className="h-5 w-5 mr-3" />
                      <span className="hidden md:inline">Exporter</span>
                    </a>
                  </Link>
                </>
              )}
              <Link href="/Combine">
                <a className={`flex items-center p-2 rounded-md transition-colors ${  'text-gray-700 hover:bg-gray-100'}`}>
                  <Home className="h-5 w-5 mr-3" />
                  <span className="hidden md:inline">Combine</span>
                </a>
              </Link>
            </nav>
            
            <div className="px-2 mt-6">
              <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="hidden md:block">
                    <p className="text-xs font-medium text-blue-700">Durum</p>
                    <p className="text-sm text-blue-600">Üretimde 12 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
