import React from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'ja' : 'ko')}
      className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200 border border-gray-200"
      title={locale === 'ko' ? '日本語に切り替え' : '한글로 전환'}
    >
      <Globe className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">
        {locale === 'ko' ? '日本語' : '한글'}
      </span>
    </button>
  );
}