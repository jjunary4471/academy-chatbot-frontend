import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  MessageSquare, 
  MessagesSquare,
  ChevronRight,
  User
} from 'lucide-react';
import UserHeader from './UserHeader';

export default function StudentMainPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    {
      id: 'type-check',
      title: '타입진단',
      description: '나의 성향과 학습 스타일을 알아보세요',
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      onClick: () => navigate('/personality-test'),
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100'
    },
    {
      id: 'chatbot',
      title: '챗봇상담',
      description: '궁금한 점을 자유롭게 물어보세요',
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      onClick: () => navigate('/chatbot'),
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-100'
    },
    {
      id: 'matching-qa',
      title: '맞춤질문답변',
      description: '학부모님의 질문에 답변해주세요',
      icon: <MessagesSquare className="w-8 h-8 text-purple-500" />,
      onClick: () => navigate('/matching-qa'),
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">학생 대시보드</h1>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                안녕하세요, {user.name}님!
              </h2>
              <p className="text-gray-600">
                오늘도 함께 성장해보아요
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full ${item.bgColor} rounded-2xl p-4 transition-transform active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
            >
              <div className="flex items-center gap-4">
                <div className={`${item.iconBgColor} rounded-xl p-2`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            최근 활동
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    성격 진단 완료
                  </h4>
                  <p className="text-xs text-gray-500">
                    2024년 3월 15일
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="bg-green-100 rounded-lg p-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    챗봇 상담
                  </h4>
                  <p className="text-xs text-gray-500">
                    2024년 3월 14일
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}