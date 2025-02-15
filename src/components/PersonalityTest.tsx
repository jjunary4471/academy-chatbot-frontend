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
import { useLocale } from '../contexts/LocaleContext';

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
  const { t } = useLocale();

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
      primaryType = '사쿠라';
    }

    const secondaryType: PersonalityResult['secondaryType'] = 
      cScore > 5 ? '디지털' : '아날로그';

    return { primaryType, secondaryType };
  };

  const submitResults = async (result: PersonalityResult) => {
    try {
      if (!user.id) {
        throw new Error(t('auth.login.userNotFound'));
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
          t('personality.test.error')
        );
      }

      alert(t('personality.test.complete'));
      navigate('/student-main');

    } catch (err) {
      console.error('Error submitting results:', err);
      setError(err instanceof Error ? err.message : t('personality.test.error'));
      
      if (err instanceof Error && 
          (err.message.includes(t('auth.login.userNotFound')) || 
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
      setError('');
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
    return t(`personality.test.section.${section}`);
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
              <h1 className="text-2xl font-bold text-gray-800">{t('personality.test.title')}</h1>
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
                {t('personality.test.progress', { 
                  current: String(sectionAnswers.length), 
                  total: String(QUESTIONS_PER_SECTION) 
                })}
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
                          <span className="text-xs">{t('personality.test.answer.yes')}</span>
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
                          <span className="text-xs">{t('personality.test.answer.no')}</span>
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
              {t('common.back')}
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
              {isSubmitting ? t('common.processing') : currentSection === SECTIONS.length - 1 ? t('common.complete') : t('common.next')}
              {!isSubmitting && currentSection < SECTIONS.length - 1 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}