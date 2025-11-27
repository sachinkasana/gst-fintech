import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Users, BarChart3 } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/invoices', icon: FileText, label: 'Invoices' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 py-3 px-4 flex-1
              ${isActive ? 'text-primary' : 'text-textSecondary'}
            `}
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
