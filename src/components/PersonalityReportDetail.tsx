import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Flower2, 
  Apple, 
  Grape, 
  Laptop, 
  Clock,
  Brain,
  GraduationCap,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Cherry
} from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import NavigationHeader from './shared/NavigationHeader';
import type { PersonalityReport, Student } from '../types';

const getPersonalityIcon = (type: string) => {
  switch (type) {
    case 'さくら':
    case '사쿠라':
      return <Flower2 className="w-8 h-8 text-pink-400" aria-label="사쿠라" />;
    case 'うめ':
    case '우메':
      return <Cherry className="w-8 h-8 text-red-400" aria-label="우메" />;
    case 'もも':
    case '모모':
      return <Apple className="w-8 h-8 text-orange-400" aria-label="모모" />;
    case 'すもも':
    case '스모모':
      return <Grape className="w-8 h-8 text-purple-400" aria-label="스모모" />;
    case 'デジタル':
    case '디지털':
      return <Laptop className="w-8 h-8 text-blue-400" aria-label="디지털" />;
    case 'アナログ':
    case '아날로그':
      return <Clock className="w-8 h-8 text-gray-400" aria-label="아날로그" />;
    default:
      return null;
  }
};

interface LocationState {
  report: PersonalityReport;
  student: Student;
}

export default function PersonalityReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { report, student } = (location.state || {}) as LocationState;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 2;
  const { t } = useLocale();

  if (!report?.result || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{t('common.noData')}</div>
      </div>
    );
  }

  const typeDescriptions: { [key: string]: string } = {
    'さくら': t('personality.type.sakura.desc'),
    '사쿠라': t('personality.type.sakura.desc'),
    'うめ': t('personality.type.ume.desc'),
    '우메': t('personality.type.ume.desc'),
    'もも': t('personality.type.momo.desc'),
    '모모': t('personality.type.momo.desc'),
    'すもも': t('personality.type.sumomo.desc'),
    '스모모': t('personality.type.sumomo.desc'),
    'デジタル': t('personality.type.digital.desc'),
    '디지털': t('personality.type.digital.desc'),
    'アナログ': t('personality.type.analog.desc'),
    '아날로그': t('personality.type.analog.desc')
  };

  const learningRecommendations: { [key: string]: string[] } = {
    'さくら': [
      t('personality.type.sakura.rec1'),
      t('personality.type.sakura.rec2'),
      t('personality.type.sakura.rec3')
    ],
    '사쿠라': [
      t('personality.type.sakura.rec1'),
      t('personality.type.sakura.rec2'),
      t('personality.type.sakura.rec3')
    ],
    'うめ': [
      t('personality.type.ume.rec1'),
      t('personality.type.ume.rec2'),
      t('personality.type.ume.rec3')
    ],
    '우메': [
      t('personality.type.ume.rec1'),
      t('personality.type.ume.rec2'),
      t('personality.type.ume.rec3')
    ],
    'もも': [
      t('personality.type.momo.rec1'),
      t('personality.type.momo.rec2'),
      t('personality.type.momo.rec3')
    ],
    '모모': [
      t('personality.type.momo.rec1'),
      t('personality.type.momo.rec2'),
      t('personality.type.momo.rec3')
    ],
    'すもも': [
      t('personality.type.sumomo.rec1'),
      t('personality.type.sumomo.rec2'),
      t('personality.type.sumomo.rec3')
    ],
    '스모모': [
      t('personality.type.sumomo.rec1'),
      t('personality.type.sumomo.rec2'),
      t('personality.type.sumomo.rec3')
    ],
    'デジタル': [
      t('personality.type.digital.rec1'),
      t('personality.type.digital.rec2'),
      t('personality.type.digital.rec3')
    ],
    '디지털': [
      t('personality.type.digital.rec1'),
      t('personality.type.digital.rec2'),
      t('personality.type.digital.rec3')
    ],
    'アナログ': [
      t('personality.type.analog.rec1'),
      t('personality.type.analog.rec2'),
      t('personality.type.analog.rec3')
    ],
    '아날로그': [
      t('personality.type.analog.rec1'),
      t('personality.type.analog.rec2'),
      t('personality.type.analog.rec3')
    ]
  };

  const primaryTypeDesc = typeDescriptions[report.result.primaryType] || t('common.noData');
  const secondaryTypeDesc = typeDescriptions[report.result.secondaryType] || t('common.noData');
  const primaryRecommendations = learningRecommendations[report.result.primaryType] || [];
  const secondaryRecommendations = learningRecommendations[report.result.secondaryType] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavigationHeader 
        title={t('report.detail.title')}
        activeNavId="report"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">{t('report.detail.studentInfo')}</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{t('common.name')}: {student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{t('report.detail.testDate')}: {report.testDate}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">{t('report.result')}</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getPersonalityIcon(report.result.primaryType)}
                  <span className="text-gray-600">{report.result.primaryType}</span>
                </div>
                <span className="text-gray-300">/</span>
                <div className="flex items-center gap-2">
                  {getPersonalityIcon(report.result.secondaryType)}
                  <span className="text-gray-600">{report.result.secondaryType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">{t('report.detail.analysis')}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getPersonalityIcon(report.result.primaryType)}
                  <h3 className="text-lg font-medium text-gray-800">
                    {t('report.detail.primaryType')}: {report.result.primaryType}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{primaryTypeDesc}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getPersonalityIcon(report.result.secondaryType)}
                  <h3 className="text-lg font-medium text-gray-800">
                    {t('report.detail.secondaryType')}: {report.result.secondaryType}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{secondaryTypeDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">{t('report.detail.recommendations')}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-800">{t('report.detail.primaryType')}</h3>
                </div>
                <ul className="space-y-2">
                  {primaryRecommendations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-800">{t('report.detail.secondaryType')}</h3>
                </div>
                <ul className="space-y-2">
                  {secondaryRecommendations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}