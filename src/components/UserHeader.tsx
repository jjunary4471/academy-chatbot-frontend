import React from 'react';
import { GraduationCap, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  name: string;
  role: number;
}

export default function UserHeader({ name, role }: UserHeaderProps) {
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch (role) {
      case 1:
        return <GraduationCap className="w-6 h-6" />;
      case 2:
        return <User className="w-6 h-6" />;
      case 3:
        return <Users className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
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

  const handleIconClick = () => {
    switch (role) {
      case 1:
        navigate('/admin');
        break;
      case 2:
        navigate('/student-main');
        break;
      case 3:
        navigate('/parent-main');
        break;
      default:
        break;
    }
  };

  return (
    <button 
      onClick={handleIconClick}
      className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
    >
      {getRoleIcon()}
      <span className="text-sm text-gray-500">{getRoleText()}</span>
      <span className="font-medium">{name}</span>
    </button>
  );
}