import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Flower2, 
  Apple, 
  Grape, 
  Laptop, 
  Clock,
  Brain,
  Heart,
  Users,
  Target,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import type { PersonalityReport } from '../types';
import UserHeader from './UserHeader';

const getPersonalityIcon = (type: string) => {
  switch (type) {
    case '벗꽃':
      return <Flower2 className="w-6 h-6 text-pink-400" aria-label="벗꽃" />;
    case '복숭아':
      return <Apple className="w-6 h-6 text-orange-400" aria-label="복숭아" />;
    case '자두':
      return <Grape className="w-6 h-6 text-purple-400" aria-label="자두" />;
    case '디지털':
      return <Laptop className="w-6 h-6 text-blue-400" aria-label="디지털" />;
    case '아날로그':
      return <Clock className="w-6 h-6 text-gray-400" aria-label="아날로그" />;
    default:
      return null;
  }
};

const PersonalityTypeCard = ({ type, description }: { type: string; description: string }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
    {getPersonalityIcon(type)}
    <div>
      <h3 className="font-semibold text-lg text-gray-800">{type}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

const CharacteristicSection = ({ 
  icon, 
  title, 
  items 
}: { 
  icon: React.ReactNode; 
  title: string; 
  items: string[];
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">•</span>
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function PersonalityReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const report = location.state?.report as PersonalityReport;
  const student = location.state?.student;

  if (!report || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">레포트 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 성격 유형별 설명 (예시)
  const typeDescriptions = {
    벗꽃: "새로운 것을 배우는 것을 좋아하며, 호기심이 많고 창의적입니다.",
    복숭아: "차분하고 신중하며, 깊이 있는 사고를 하는 성향입니다.",
    자두: "활발하고 적극적이며, 다른 사람들과 어울리기를 좋아합니다.",
    디지털: "논리적이고 체계적인 접근을 선호하며, 효율성을 중시합니다.",
    아날로그: "감성적이고 직관적인 접근을 선호하며, 창의성을 중시합니다."
  };

  // 학습 특성 (예시)
  const learningCharacteristics = [
    "체계적이고 계획적인 학습을 선호합니다.",
    "시각적 자료를 통한 학습이 효과적입니다.",
    "실제 사례를 통한 학습을 선호합니다.",
    "새로운 개념을 빠르게 습득합니다."
  ];

  // 대인관계 특성 (예시)
  const socialCharacteristics = [
    "타인의 감정을 잘 이해하고 공감합니다.",
    "리더십을 발휘하는 것을 좋아합니다.",
    "협동 학습에서 좋은 성과를 보입니다.",
    "적극적으로 의견을 제시합니다."
  ];

  // 학습 추천사항 (예시)
  const recommendations = [
    "시각적 학습 자료 활용을 권장합니다.",
    "그룹 활동 참여를 장려합니다.",
    "실습 위주의 학습을 제공합니다.",
    "창의적 문제 해결 기회를 제공합니다."
  ];

  // 소통 방법 (예시)
  const communicationTips = [
    "명확하고 구체적인 피드백을 제공합니다.",
    "긍정적인 강화를 활용합니다.",
    "학생의 의견을 경청하고 존중합니다.",
    "감정적 교류를 중요시합니다."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
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
              <h1 className="text-2xl font-bold text-gray-800">성격 진단 상세 레포트</h1>
            </div>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* 기본 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">학생 정보</h2>
              <div className="space-y-2">
                <p className="text-gray-600">이름: {student.name}</p>
                <p className="text-gray-600">진단일: {report.testDate}</p>
              </div>
            </div>
          </div>

          {/* 성격 유형 */}
          <div className="grid md:grid-cols-2 gap-6">
            <PersonalityTypeCard 
              type={report.result.primaryType} 
              description={typeDescriptions[report.result.primaryType]}
            />
            <PersonalityTypeCard 
              type={report.result.secondaryType} 
              description={typeDescriptions[report.result.secondaryType]}
            />
          </div>

          {/* 특성 및 추천사항 */}
          <div className="grid md:grid-cols-2 gap-6">
            <CharacteristicSection
              icon={<Brain className="w-6 h-6 text-blue-500" />}
              title="학습 특성"
              items={learningCharacteristics}
            />
            <CharacteristicSection
              icon={<Users className="w-6 h-6 text-green-500" />}
              title="대인관계 특성"
              items={socialCharacteristics}
            />
            <CharacteristicSection
              icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
              title="학습 추천사항"
              items={recommendations}
            />
            <CharacteristicSection
              icon={<MessageCircle className="w-6 h-6 text-purple-500" />}
              title="소통 방법"
              items={communicationTips}
            />
          </div>
        </div>
      </div>
    </div>
  );
}