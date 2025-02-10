import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import type { SignupForm } from '../types';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({
    academyId: '',
    id: '',
    name: '',
    role: 2, // Default to STUDENT
    email: '',
    childId: '',
    admissionDate: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
      };
      
      // Remove childId if not PARENT
      if (formData.role !== 3) {
        delete payload.childId;
      }

      // Remove admissionDate if not STUDENT
      if (formData.role !== 2) {
        delete payload.admissionDate;
      }

      console.log('Sending signup request with payload:', payload);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Signup failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          errorData?.message || 
          `회원가입에 실패했습니다. (Status: ${response.status})`
        );
      }

      console.log('Signup successful');
      navigate('/', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
      } else {
        setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <UserPlus className="w-16 h-16 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="academyId" className="block text-sm font-medium text-gray-700 mb-1">
              아카데미 ID
            </label>
            <input
              id="academyId"
              type="text"
              required
              value={formData.academyId}
              onChange={(e) => setFormData(prev => ({ ...prev, academyId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
              사용자 ID
            </label>
            <input
              id="id"
              type="text"
              required
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              역할
            </label>
            <select
              id="role"
              required
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>교사 (TEACHER)</option>
              <option value={2}>학생 (STUDENT)</option>
              <option value={3}>학부모 (PARENT)</option>
            </select>
          </div>

          {formData.role === 2 && (
            <div>
              <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700 mb-1">
                입학일
              </label>
              <input
                id="admissionDate"
                type="date"
                required
                value={formData.admissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {formData.role === 3 && (
            <div>
              <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1">
                자녀 ID
              </label>
              <input
                id="childId"
                type="text"
                required
                value={formData.childId}
                onChange={(e) => setFormData(prev => ({ ...prev, childId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '처리중...' : '회원가입'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
}