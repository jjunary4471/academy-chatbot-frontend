import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu,
  Send,
  Bot,
  UserIcon,
  Loader2,
  ClipboardList,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import UserHeader from './UserHeader';
import { useLocale } from '../contexts/LocaleContext';
import type { User } from '../types';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export default function StudentMainPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
  const { t } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 초기 인사 메시지
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: t('dashboard.welcome.message'),
        timestamp: new Date()
      }
    ]);
  }, [t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendMessageToServer = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/students/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          message: message
        }),
      });

      if (!response.ok) {
        throw new Error(t('student.chatbot.error'));
      }

      const data = await response.json();
      if (!data.response) {
        throw new Error(t('student.chatbot.error'));
      }

      // Remove quotes from the response string
      return data.response.replace(/^"|"$/g, '');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to server and get response
      const botResponse = await sendMessageToServer(messageContent);
      
      // Add bot response
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: t('student.chatbot.error'),
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const menuItems = [
    {
      id: 'personality-test',
      title: t('student.menu.typeCheck'),
      description: t('student.menu.typeCheck.desc'),
      icon: <ClipboardList className="w-5 h-5" />,
      onClick: () => {
        navigate('/personality-test');
        setIsMenuOpen(false);
      }
    },
    {
      id: 'personality-report',
      title: t('report.title'),
      description: t('student.menu.report.desc'),
      icon: <FileText className="w-5 h-5" />,
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
        setIsMenuOpen(false);
      },
      disabled: !user.personalityResult
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* 햄버거 메뉴 */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                aria-label={isMenuOpen ? t('common.close') : t('common.menu')}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-blue-600" />
                ) : (
                  <Menu className="w-5 h-5 text-blue-600" />
                )}
              </button>

              {/* 메뉴 드롭다운 */}
              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={`w-full px-4 py-2 flex flex-col gap-1 transition-colors ${
                        item.disabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600">{item.icon}</span>
                        <span className="text-gray-700">{item.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 pl-8">{item.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-100' : message.error ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {message.type === 'user' ? (
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  ) : message.error ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.error
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-white text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('student.chatbot.placeholder')}
                className="w-full resize-none rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 max-h-32"
                rows={1}
                style={{
                  minHeight: '2.5rem',
                  height: 'auto'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                newMessage.trim() && !isTyping
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label={t('student.chatbot.send')}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}