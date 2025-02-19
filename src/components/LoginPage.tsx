import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { School } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import LocaleToggle from './LocaleToggle';
import { fetchApi } from '../utils/api';
import type { User } from '../types';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string>('');
  const { t } = useLocale();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
      switch (user.role) {
        case 1:
          navigate('/admin');
          break;
        case 2:
          navigate('/student-main');
          break;
        case 3:
          navigate('/parent-main');
          break;
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userData = await fetchApi(`/users/${userId}`);
      localStorage.setItem('user', JSON.stringify(userData));

      switch (userData.role) {
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
          throw new Error('잘못된 사용자 역할입니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError(t('auth.login.networkError'));
      } else {
        setError(err instanceof Error ? err.message : t('auth.login.failed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4">
        <LocaleToggle />
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <School className="w-16 h-16 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">{t('auth.login.title')}</h1>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.id')}
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={t('auth.login.enterUserId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? t('auth.login.processing') : t('common.login')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              {t('common.signup')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}