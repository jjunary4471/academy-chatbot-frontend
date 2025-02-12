import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { questions, Question } from '../data/personalityQuestions';
import UserHeader from './UserHeader';

const QUESTIONS_PER_SECTION = 10;
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'S'];

interface Answer {
  questionId: number;
  answer: boolean;
}

interface PersonalityResult {
  primaryType: '벗꽃' | '복숭아' | '자두' | '매실';
  secondaryType: '디지털' | '아날로그';
}

export default function PersonalityTest() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestions = questions.filter(q => q.section === SECTIONS[currentSection]);
  const sectionAnswers = answers.filter(a => 
    currentQuestions.some(q => q.id === a.questionId)
  );

  const handleAnswer = (questionId: number, answer: boolean) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, answer }];
    });
  };

  const canProceed = () => {
    return sectionAnswers.length === QUESTIONS_PER_SECTION;
  };

  const calculateFactorScore = (factor: string) => {
    const factorQuestions = questions.filter(q => q.factor === factor);
    const factorAnswers = answers.filter(a => 
      factorQuestions.some(q => q.id === a.questionId && a.answer)
    );
    return factorAnswers.length;
  };

  const determinePersonalityType = (): PersonalityResult => {
    const aScore = calculateFactorScore('A');
    const bScore = calculateFactorScore('B');
    const cScore = calculateFactorScore('C');
    const dScore = calculateFactorScore('D');
    const eScore = calculateFactorScore('E');

    let primaryType: PersonalityResult['primaryType'];

    // さくら (벗꽃)
    if (aScore < 5 && bScore >= 5 && cScore >= 5 && dScore >= 5 && eScore < 5) {
      primaryType = '사쿠라';
    }
    // うめ (매실)
    else if (aScore >= 5 && bScore < 5 && cScore >= 5 && dScore >= 5 && eScore < 5) {
      primaryType = '우메';
    }
    // もも (복숭아)
    else if (aScore < 5 && bScore < 5 && cScore >= 5 && dScore < 5 && eScore >= 5) {
      primaryType = '모모';
    }
    // すもも (자두)
    else if (aScore >= 5 && bScore < 5 && cScore >= 5 && dScore < 5 && eScore >= 5) {
      primaryType = '스모모';
    }
    else {
      // 기본값으로 가장 근접한 유형 선택
      primaryType = '사쿠라';
    }

    // デジタル/アナログ 판정
    const secondaryType: PersonalityResult['secondaryType'] = 
      cScore > 5 ? '디지털' : '아날로그';

    return { primaryType, secondaryType };
  };

  const submitResults = async (result: PersonalityResult) => {
    try {
      if (!user.id) {
        throw new Error('사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(`/api/students/${user.id}/personalityResult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          academyId: user.academyId,
          diagnosisDate: new Date().toISOString().split('T')[0],
          primaryType: result.primaryType,
          secondaryType: result.secondaryType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `진단 결과 저장에 실패했습니다. (Status: ${response.status})`
        );
      }

      // 성공 메시지 표시
      alert('성격 진단이 완료되었습니다.');
      
      // 학생 메인 화면으로 이동
      navigate('/student-main');

    } catch (err) {
      console.error('Error submitting results:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      
      // 심각한 오류인 경우에만 메인 페이지로 이동
      if (err instanceof Error && 
          (err.message.includes('사용자 정보가 올바르지 않습니다') || 
           err.message.includes('Failed to fetch'))) {
        navigate('/student-main');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      setError(''); // 이전 에러 메시지 초기화
      const result = determinePersonalityType();
      await submitResults(result);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'A': return '규범성';
      case 'B': return '협조성';
      case 'C': return '논리성';
      case 'D': return '활동성';
      case 'E': return '안정성';
      case 'S': return '스트레스';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">성격 진단 테스트</h1>
            </div>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-[73px] left-0 right-0 z-20 bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4">
        {/* Fixed Progress Section */}
        <div className="fixed top-[73px] left-0 right-0 z-10 bg-white border-b">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {getSectionTitle(SECTIONS[currentSection])} ({currentSection + 1}/6)
              </h2>
              <span className="text-sm text-gray-600">
                {sectionAnswers.length}/{QUESTIONS_PER_SECTION} 답변 완료
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${(currentSection / SECTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Questions Section */}
        <div className="mt-[160px] mb-[100px] space-y-6">
          {currentQuestions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id);
            return (
              <div 
                key={question.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-4">{question.text}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleAnswer(question.id, true)}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          answer?.answer === true
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 text-gray-700 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-xs">はい</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleAnswer(question.id, false)}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          answer?.answer === false
                            ? 'bg-red-500 text-white border-red-500'
                            : 'border-gray-300 text-gray-700 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <XCircle className="w-5 h-5" />
                          <span className="text-xs">いいえ</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentSection === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                canProceed() && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '처리중...' : currentSection === SECTIONS.length - 1 ? '완료' : '다음'}
              {!isSubmitting && currentSection < SECTIONS.length - 1 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}