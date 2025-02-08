import React from 'react';
import { GraduationCap, User, Users } from 'lucide-react';

interface UserHeaderProps {
  name: string;
  role: number;
}

export default function UserHeader({ name, role }: UserHeaderProps) {
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

  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
      {getRoleIcon()}
      <span className="text-sm text-gray-500">{getRoleText()}</span>
      <span className="font-medium">{name}</span>
    </div>
  );
}