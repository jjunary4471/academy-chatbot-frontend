import React, { useState, useRef, useEffect } from 'react';
import { 
  Send,
  Bot,
  UserIcon,
  Loader2,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import NavigationHeader from './shared/NavigationHeader';
import type { User, Message } from '../types';

// 더미 질문 데이터
const dummyQuestions = [
  "오늘 학교에서 있었던 일 중 가장 기억에 남는 것은 무엇인가요?",
  "최근에 읽은 책이나 본 영화 중에서 인상 깊었던 것을 이야기해주세요.",
  "자신의 장점과 단점은 무엇이라고 생각하나요?",
  "앞으로의 꿈이나 목표는 무엇인가요?",
  "친구들과의 관계에서 중요하게 생각하는 것은 무엇인가요?",
  "학교생활에서 가장 즐거운 순간은 언제인가요?",
  "어려움을 겪을 때 어떻게 극복하나요?",
  "자신만의 스트레스 해소 방법이 있나요?",
  "가장 좋아하는 과목과 그 이유는 무엇인가요?",
  "방과 후에는 주로 무엇을 하며 시간을 보내나요?"
];

// 더미 응답 데이터
const dummyResponses = [
  "그렇군요. 그런 경험이 앞으로의 성장에 도움이 될 것 같아요.",
  "흥미로운 이야기네요. 더 자세히 들려주시겠어요?",
  "당신의 생각이 잘 전달되었어요. 저도 비슷한 경험이 있어요.",
  "그런 관점으로 바라보다니 놀랍네요. 새로운 시각을 배웠어요.",
  "정말 좋은 생각이에요. 그런 태도가 중요하죠.",
  "당신의 이야기를 들으니 저도 힘이 나네요.",
  "그런 경험이 있었군요. 어려운 상황이었을 텐데 잘 극복하셨네요.",
  "당신의 솔직한 이야기에 감동받았어요.",
  "그런 생각을 가지고 있다니 멋져요.",
  "앞으로도 그런 긍정적인 마음가짐을 유지하면 좋겠어요."
];

export default function CommunityChat() {
  const { t } = useLocale();
  const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 초기 메시지 설정
    const initialQuestion = dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: initialQuestion,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const simulateResponse = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const response = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
        resolve(response);
      }, 1000);
    });
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
      // 봇 응답 시뮬레이션
      const botResponse = await simulateResponse();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);

      // 새로운 질문 추가
      setTimeout(() => {
        const nextQuestion = dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: nextQuestion,
          timestamp: new Date()
        }]);
      }, 1000);

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
        title={t('student.menu.community')}
        activeNavId="community"
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