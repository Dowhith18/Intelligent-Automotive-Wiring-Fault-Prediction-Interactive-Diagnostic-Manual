import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, Wrench, User, Settings, Camera, Video, Network, Wifi } from './icons';

const navigation = [
  { name: 'New Vehicle', href: '/app/vehicles', icon: Car },
  { name: 'Diagnostics', href: '/app/diagnostics', icon: Wrench },
];

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-mida-surface">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-mida-border">
          <img src="https://i.imgur.com/rL6p3TL.png" alt="Mida Logo" className="h-10 w-auto" />
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 border-b border-mida-border">
            <div className="flex items-center space-x-3">
              <div className="bg-mida-border rounded-full h-10 w-10 flex items-center justify-center">
                <User className="h-6 w-6 text-mida-text-secondary" />
              </div>
              <span className="font-semibold text-mida-text-primary">25020614</span>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-semibold rounded-md ${
                    isActive
                      ? 'bg-mida-accent-red-dark text-white'
                      : 'text-mida-text-primary hover:bg-mida-border'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-4 space-y-4">
            <div className="bg-mida-bg rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-mida-text-secondary" />
                <span className="text-sm font-medium">App Idle</span>
              </div>
            </div>
            <div className="bg-mida-accent-green-dark rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-mida-accent-green" />
                <span className="text-sm font-bold text-white">Garuda Connected</span>
              </div>
              <button className="text-xs text-mida-text-secondary hover:text-white">Connect</button>
            </div>
          </div>
          
          <div className="p-2 bg-mida-bg flex justify-around items-center border-t border-mida-border">
            <button className="p-2 text-mida-text-secondary hover:text-white rounded-full hover:bg-mida-border">
                <Camera className="w-5 h-5" />
                <span className="sr-only">Screenshot</span>
            </button>
            <button className="p-2 text-mida-text-secondary hover:text-white rounded-full hover:bg-mida-border">
                <Video className="w-5 h-5" />
                <span className="sr-only">Screen Record</span>
            </button>
            <button className="p-2 text-mida-text-secondary hover:text-white rounded-full hover:bg-mida-border">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
            </button>
            <button className="p-2 text-green-500 rounded-full hover:bg-mida-border">
                <Network className="w-5 h-5" />
                <span className="sr-only">Network</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
