import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Flower2, 
  Apple, 
  Grape, 
  Laptop, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import type { PersonalityReport, Student } from '../types';
import UserHeader from './UserHeader';

const getPersonalityIcon = (type: string) => {
  switch (type) {
    case '벗꽃':
      return <Flower2 className="w-4 h-4 text-pink-400" aria-label="벗꽃" />;
    case '복숭아':
      return <Apple className="w-4 h-4 text-orange-400" aria-label="복숭아" />;
    case '자두':
      return <Grape className="w-4 h-4 text-purple-400" aria-label="자두" />;
    case '디지털':
      return <Laptop className="w-4 h-4 text-blue-400" aria-label="디지털" />;
    case '아날로그':
      return <Clock className="w-4 h-4 text-gray-400" aria-label="아날로그" />;
    default:
      return null;
  }
};

const PersonalityDisplay = ({ primaryType, secondaryType }: { primaryType: string; secondaryType: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  return (
    <button 
      className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded-md transition-colors"
      onClick={() => {
        const mockReport = {
          id: '1',
          studentId: student.id,
          testDate: '2024-03-15',
          result: {
            primaryType,
            secondaryType
          }
        };
        navigate('/personality-report', { 
          state: { 
            report: mockReport,
            student
          } 
        });
      }}
    >
      <div className="flex items-center gap-1">
        {getPersonalityIcon(primaryType)}
        <span className="text-sm">{primaryType}</span>
      </div>
      <span className="text-gray-300">/</span>
      <div className="flex items-center gap-1">
        {getPersonalityIcon(secondaryType)}
        <span className="text-sm">{secondaryType}</span>
      </div>
    </button>
  );
};

// 샘플 데이터
const mockReports: PersonalityReport[] = [
  {
    id: '1',
    studentId: '1',
    testDate: '2024-03-15',
    result: {
      primaryType: '벗꽃',
      secondaryType: '디지털'
    }
  },
  {
    id: '2',
    studentId: '1',
    testDate: '2024-02-15',
    result: {
      primaryType: '복숭아',
      secondaryType: '아날로그'
    }
  },
  {
    id: '3',
    studentId: '1',
    testDate: '2024-01-15',
    result: {
      primaryType: '자두',
      secondaryType: '디지털'
    }
  }
];

export default function StudentReportList() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">학생 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">성격 진단 레포트</h1>
            </div>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">학생 정보</h2>
              <div className="space-y-2">
                <p className="text-gray-600">이름: {student.name}</p>
                <p className="text-gray-600">입학일: {student.admissionDate || '-'}</p>
                {student.personalityResult && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">현재 성격 유형:</span>
                    <PersonalityDisplay 
                      primaryType={student.personalityResult.primaryType || '벗꽃'} 
                      secondaryType={student.personalityResult.secondaryType || '디지털'} 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">학부모 정보</h2>
              {student.familyInfo ? (
                <p className="text-gray-600">{student.familyInfo.parentName}</p>
              ) : (
                <p className="text-gray-500 italic">등록된 학부모 정보가 없습니다</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">레포트 일람</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      진단일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      진단 결과
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockReports.map((report, index) => (
                    <tr key={report.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.testDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PersonalityDisplay 
                          primaryType={report.result.primaryType} 
                          secondaryType={report.result.secondaryType} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}