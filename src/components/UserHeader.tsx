import React from 'react';
import { GraduationCap, User, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocaleToggle from './LocaleToggle';

interface UserHeaderProps {
  name: string;
  role: number;
}

export default function UserHeader({ name, role }: UserHeaderProps) {
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch (role) {
      case 1:
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 2:
        return <User className="w-5 h-5 text-green-600" />;
      case 3:
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleText = () => {
    switch (role) {
      case 1:
        return '교사';
      case 2:
        return '학생';
      case 3:
        return '학부모';
      default:
        return '';
    }
  };

  const getHomeRoute = () => {
    switch (role) {
      case 1:
        return '/admin';
      case 2:
        return '/student-main';
      case 3:
        return '/parent-main';
      default:
        return '/';
    }
  };

  const handleHomeClick = () => {
    navigate(getHomeRoute());
  };

  return (
    <div className="flex items-center gap-2">
      <LocaleToggle />
      
      <button
        onClick={handleHomeClick}
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200 border border-gray-200 group"
        title="홈"
      >
        <Home className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </button>
      
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          {getRoleIcon()}
          <span className="text-sm font-medium" style={{ 
            color: role === 1 ? '#2563eb' : 
                   role === 2 ? '#16a34a' : 
                   role === 3 ? '#9333ea' : '#4b5563'
          }}>
            {getRoleText()}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200"></div>
        <span className="text-sm text-gray-700">{name}</span>
      </div>
    </div>
  );
}