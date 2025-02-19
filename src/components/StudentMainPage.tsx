import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send,
  Bot,
  UserIcon,
  Loader2,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { fetchApi } from '../utils/api';
import NavigationHeader from './shared/NavigationHeader';
import type { User, Message } from '../types';

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

  const sendMessageToServer = async (message: string): Promise<string> => {
    try {
      const response = await fetchApi('/students/chat', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          message: message
        }),
      });

      return response.response.replace(/^"|"$/g, '');
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const botResponse = await sendMessageToServer(messageContent);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavigationHeader 
        title={t('student.menu.chatbot')}
        activeNavId="chat"
      />

      <div className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm border border-blue-100">
              <UserCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {t('dashboard.welcome', { name: user.name })}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 overflow-hidden flex flex-col">
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

        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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