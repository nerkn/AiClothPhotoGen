import React, { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Layers, Bell, Settings, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <Layers className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">AI Yönetimi</span>
                </a>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="h-6 w-6" />
            </button>
            
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Settings className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button className="flex items-center p-1 rounded-full border-2 border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors">
                <span className="sr-only">Kullanıcı menüsü</span>
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                  <User className="h-5 w-5" />
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Ana menü</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="py-2 space-y-1">
            <Link href="/">
              <a className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Dashboard
              </a>
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                  <User className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Admin</div>
                <div className="text-sm font-medium text-gray-500">admin@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Bildirimler
              </button>
              <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Ayarlar
              </button>
              <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Çıkış
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;