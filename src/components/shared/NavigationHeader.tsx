import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Users,
  FileText,
  ClipboardList
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import type { User } from '../../types';

interface NavigationHeaderProps {
  title: string;
  activeNavId: string;
}

export default function NavigationHeader({ title, activeNavId }: NavigationHeaderProps) {
  const navigate = useNavigate();
  const { t } = useLocale();
  const user = JSON.parse(localStorage.getItem('user') || '{}') as User;

  const navItems = [
    {
      id: 'home',
      icon: <Home className="w-6 h-6" />,
      activeIcon: <Home className="w-6 h-6 text-blue-600" />,
      label: t('common.home'),
      description: t('student.menu.home.desc'),
      onClick: () => navigate('/student-main')
    },
    {
      id: 'chat',
      icon: (
        <img 
          src="https://d2idstoqcmyhkz.cloudfront.net/headset_mic.png"
          alt="상담"
          className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity"
        />
      ),
      activeIcon: (
        <img 
          src="https://d2idstoqcmyhkz.cloudfront.net/headset_mic.png"
          alt="상담"
          className="w-6 h-6"
        />
      ),
      label: t('student.menu.chatbot'),
      description: t('student.menu.chatbot.desc'),
      onClick: () => navigate('/student-main')
    },
    {
      id: 'community',
      icon: <Users className="w-6 h-6" />,
      activeIcon: <Users className="w-6 h-6 text-blue-600" />,
      label: t('student.menu.community'),
      description: t('student.menu.community.desc'),
      onClick: () => navigate('/community')
    },
    {
      id: 'test',
      icon: <ClipboardList className="w-6 h-6" />,
      activeIcon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      label: t('personality.test.title'),
      description: t('student.menu.typeCheck.desc'),
      onClick: () => navigate('/personality-test')
    },
    {
      id: 'report',
      icon: <FileText className="w-6 h-6" />,
      activeIcon: <FileText className="w-6 h-6 text-blue-600" />,
      label: t('report.title'),
      description: t('student.menu.report.desc'),
      onClick: () => {
        if (user.personalityResult) {
          const mockReport = {
            id: `${user.id}-${new Date().toISOString().split('T')[0]}`,
            studentId: user.id,
            testDate: new Date().toISOString().split('T')[0],
            result: user.personalityResult
          };
          navigate('/personality-report', { 
            state: { 
              student: user,
              report: mockReport
            } 
          });
        }
      },
      disabled: !user.personalityResult
    }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button 
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    item.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : activeNavId === item.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  aria-label={item.label}
                >
                  {typeof item.icon === 'string' ? (
                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  ) : activeNavId === item.id ? item.activeIcon : item.icon}
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}