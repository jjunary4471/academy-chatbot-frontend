import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flower2, 
  Apple, 
  Grape, 
  Laptop, 
  Clock,
  User,
  Calendar,
  Brain,
  GraduationCap,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Cherry
} from 'lucide-react';
import UserHeader from './UserHeader';
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
  const { report, student } = location.state as LocationState || {};
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 2;

  // 필요한 데이터가 없으면 에러 메시지 표시
  if (!report || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">진단 결과를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const handleBack = () => {
    if (isStudent) {
      navigate('/student-main');
    } else {
      navigate(-1);
    }
  };

  // Personality type descriptions
  const typeDescriptions: { [key: string]: string } = {
    'さくら': "새로운 것을 배우는 것을 좋아하며, 호기심이 많고 창의적입니다.",
    '사쿠라': "새로운 것을 배우는 것을 좋아하며, 호기심이 많고 창의적입니다.",
    'うめ': "정확하고 체계적이며, 원칙을 중시하는 성향입니다.",
    '우메': "정확하고 체계적이며, 원칙을 중시하는 성향입니다.",
    'もも': "차분하고 신중하며, 깊이 있는 사고를 하는 성향입니다.",
    '모모': "차분하고 신중하며, 깊이 있는 사고를 하는 성향입니다.",
    'すもも': "활발하고 적극적이며, 다른 사람들과 어울리기를 좋아합니다.",
    '스모모': "활발하고 적극적이며, 다른 사람들과 어울리기를 좋아합니다.",
    'デジタル': "논리적이고 체계적인 접근을 선호하며, 효율성을 중시합니다.",
    '디지털': "논리적이고 체계적인 접근을 선호하며, 효율성을 중시합니다.",
    'アナログ': "감성적이고 직관적인 접근을 선호하며, 창의성을 중시합니다.",
    '아날로그': "감성적이고 직관적인 접근을 선호하며, 창의성을 중시합니다."
  };

  // Learning recommendations
  const learningRecommendations: { [key: string]: string[] } = {
    'さくら': [
      "다양한 주제의 프로젝트 학습",
      "실험과 탐구 활동",
      "창의적 문제 해결 과제"
    ],
    '사쿠라': [
      "다양한 주제의 프로젝트 학습",
      "실험과 탐구 활동",
      "창의적 문제 해결 과제"
    ],
    'うめ': [
      "체계적인 학습 계획 수립",
      "정확한 분석과 검증 활동",
      "원리 이해 중심의 학습"
    ],
    '우메': [
      "체계적인 학습 계획 수립",
      "정확한 분석과 검증 활동",
      "원리 이해 중심의 학습"
    ],
    'もも': [
      "체계적인 단계별 학습",
      "깊이 있는 주제 연구",
      "개별 학습 시간 충분히 제공"
    ],
    '모모': [
      "체계적인 단계별 학습",
      "깊이 있는 주제 연구",
      "개별 학습 시간 충분히 제공"
    ],
    'すもも': [
      "그룹 활동 중심 학습",
      "발표와 토론 기회 제공",
      "실전 문제 해결 활동"
    ],
    '스모모': [
      "그룹 활동 중심 학습",
      "발표와 토론 기회 제공",
      "실전 문제 해결 활동"
    ],
    'デジタル': [
      "온라인 학습 도구 활용",
      "데이터 기반 학습 방법",
      "체계적인 문제 해결 접근"
    ],
    '디지털': [
      "온라인 학습 도구 활용",
      "데이터 기반 학습 방법",
      "체계적인 문제 해결 접근"
    ],
    'アナログ': [
      "hands-on 학습 활동",
      "예술적 요소를 활용한 학습",
      "자유로운 표현 활동"
    ],
    '아날로그': [
      "hands-on 학습 활동",
      "예술적 요소를 활용한 학습",
      "자유로운 표현 활동"
    ]
  };

  const primaryTypeDesc = typeDescriptions[report.result.primaryType] || "성향 설명이 없습니다.";
  const secondaryTypeDesc = typeDescriptions[report.result.secondaryType] || "성향 설명이 없습니다.";
  const primaryRecommendations = learningRecommendations[report.result.primaryType] || [];
  const secondaryRecommendations = learningRecommendations[report.result.secondaryType] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">성격 진단 상세 보고서</h1>
            </div>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">학생 정보</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600">이름: {student.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600">진단일: {report.testDate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">진단 결과</h2>
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

          {/* Personality Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">성격 유형 분석</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getPersonalityIcon(report.result.primaryType)}
                  <h3 className="text-lg font-medium text-gray-800">주요 성향: {report.result.primaryType}</h3>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{primaryTypeDesc}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getPersonalityIcon(report.result.secondaryType)}
                  <h3 className="text-lg font-medium text-gray-800">보조 성향: {report.result.secondaryType}</h3>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{secondaryTypeDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Recommendations */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">맞춤형 학습 추천</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-800">주요 성향 기반 추천</h3>
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
                  <h3 className="text-lg font-medium text-gray-800">보조 성향 기반 추천</h3>
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