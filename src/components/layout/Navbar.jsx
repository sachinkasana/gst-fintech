import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
              G
            </div>
            <span className="font-bold text-lg text-textPrimary hidden sm:block">
              GST Invoice
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <User size={18} className="text-textSecondary" />
            <span className="text-sm font-medium text-textPrimary">
              {user?.username}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-100 rounded-lg text-textSecondary hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
