import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu,
  Send,
  Bot,
  UserIcon,
  Loader2,
  FileText,
  X,
  AlertCircle,
  Home,
  Headphones,
  Users,
  ClipboardList
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleViewReport = () => {
    if (user.personalityResult) {
      const mockReport = {
        id: `${user.id}-${user.personalityResult.diagnosisDate || new Date().toISOString().split('T')[0]}`,
        studentId: user.id,
        testDate: user.personalityResult.diagnosisDate || new Date().toISOString().split('T')[0],
        result: user.personalityResult
      };
      navigate('/personality-report', { 
        state: { 
          student: user,
          report: mockReport
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">학원상담</h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigation('/student-main')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleNavigation('/student-main')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Headphones className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Users className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleNavigation('/personality-test')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ClipboardList className="w-6 h-6" />
              </button>
              <button 
                onClick={handleViewReport}
                disabled={!user.personalityResult}
                className={`p-2 ${user.personalityResult ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
              >
                <FileText className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-center text-gray-800">
            학생 {user.name} 님 환영합니다
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4">
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
                        : 'bg-gray-100 text-gray-800'
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
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t bg-white px-4 py-4">
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