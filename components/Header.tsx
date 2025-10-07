import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut } from './icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-dark-surface border-b border-dark-border">
      <div className="relative z-10 flex-shrink-0 flex h-16">
        <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
          <div className="flex-1 flex">
            <form className="w-full flex md:ml-0" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" aria-hidden="true">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  name="search-field"
                  className="block w-full h-full pl-8 pr-3 py-2 border-transparent bg-transparent text-dark-text-primary placeholder-dark-text-secondary focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                  placeholder="Search vehicles, DTCs, sessions..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="p-1 rounded-full text-dark-text-secondary hover:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="max-w-xs bg-dark-surface rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-primary-500"
                  id="user-menu-button"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-dark-border flex items-center justify-center">
                    <User className="h-5 w-5 text-dark-text-secondary" />
                  </div>
                </button>
              </div>
              {isProfileOpen && (
                 <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-dark-surface ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-2 border-b border-dark-border">
                    <p className="text-sm text-dark-text-secondary">Signed in as</p>
                    <p className="text-sm font-medium text-dark-text-primary truncate">{user?.user_metadata?.name || user?.email}</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white" role="menuitem">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white" role="menuitem">Settings</a>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;