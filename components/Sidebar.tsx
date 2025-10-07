
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, Wrench, LayoutDashboard, FileSearch, BarChart2, Settings, HelpCircle } from './icons';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/app/vehicles', icon: Car },
  { name: 'Diagnostics', href: '/app/diagnostics/new', icon: Wrench },
  { name: 'Fault Codes', href: '/fault-codes', icon: FileSearch },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
];

const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-dark-surface border-r border-dark-border">
            <Wrench className="h-8 w-auto text-primary-400" />
            <span className="ml-3 text-xl font-bold text-dark-text-primary">IAWFPIDM</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-dark-surface border-r border-dark-border">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-900 text-white'
                        : 'text-dark-text-secondary hover:bg-dark-border hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto p-2">
               <nav className="space-y-1">
                 {secondaryNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-900 text-white'
                            : 'text-dark-text-secondary hover:bg-dark-border hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  ))}
               </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
