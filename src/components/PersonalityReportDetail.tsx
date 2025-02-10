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
  CheckCircle2
} from 'lucide-react';
import UserHeader from './UserHeader';
import type { PersonalityReport, Student } from '../types';

const getPersonalityIcon = (type: string) => {
  switch (type) {
    case '벗꽃':
      return <Flower2 className="w-8 h-8 text-pink-400" aria-label="벗꽃" />;
    case '복숭아':
      return <Apple className="w-8 h-8 text-orange-400" aria-label="복숭아" />;
    case '자두':
      return <Grape className="w-8 h-8 text-purple-400" aria-label="자두" />;
    case '디지털':
      return <Laptop className="w-8 h-8 text-blue-400" aria-label="디지털" />;
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
  const { report, student } = location.state as LocationState;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Personality type descriptions
  const typeDescriptions = {
    벗꽃: "새로운 것을 배우는 것을 좋아하며, 호기심이 많고 창의적입니다.",
    복숭아: "차분하고 신중하며, 깊이 있는 사고를 하는 성향입니다.",
    자두: "활발하고 적극적이며, 다른 사람들과 어울리기를 좋아합니다.",
    디지털: "논리적이고 체계적인 접근을 선호하며, 효율성을 중시합니다.",
    아날로그: "감성적이고 직관적인 접근을 선호하며, 창의성을 중시합니다."
  };

  // Learning recommendations
  const learningRecommendations = {
    벗꽃: [
      "다양한 주제의 프로젝트 학습",
      "실험과 탐구 활동",
      "창의적 문제 해결 과제"
    ],
    복숭아: [
      "체계적인 단계별 학습",
      "깊이 있는 주제 연구",
      "개별 학습 시간 충분히 제공"
    ],
    자두: [
      "그룹 활동 중심 학습",
      "발표와 토론 기회 제공",
      "실전 문제 해결 활동"
    ],
    디지털: [
      "온라인 학습 도구 활용",
      "데이터 기반 학습 방법",
      "체계적인 문제 해결 접근"
    ],
    아날로그: [
      "hands-on 학습 활동",
      "예술적 요소를 활용한 학습",
      "자유로운 표현 활동"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
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
                  <p className="text-gray-600">{typeDescriptions[report.result.primaryType as keyof typeof typeDescriptions]}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getPersonalityIcon(report.result.secondaryType)}
                  <h3 className="text-lg font-medium text-gray-800">보조 성향: {report.result.secondaryType}</h3>
                </div>
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{typeDescriptions[report.result.secondaryType as keyof typeof typeDescriptions]}</p>
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
                  {learningRecommendations[report.result.primaryType as keyof typeof learningRecommendations].map((item, index) => (
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
                  {learningRecommendations[report.result.secondaryType as keyof typeof learningRecommendations].map((item, index) => (
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