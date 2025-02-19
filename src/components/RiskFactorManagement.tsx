import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  X,
  PieChart
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useLocale } from '../contexts/LocaleContext';
import { fetchApi } from '../utils/api';
import NavigationHeader from './shared/NavigationHeader';
import type { Student, RiskHistory } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskFactorManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();
  const student = location.state?.student as Student;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [resolutionComment, setResolutionComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{t('risk.studentNotFound')}</div>
      </div>
    );
  }

  const sortedRiskHistory = [...(student.riskInfo?.RiskHistory || [])].sort((a, b) => {
    if (a.Status !== b.Status) {
      return a.Status === '00' ? -1 : 1;
    }
    return new Date(b.Date).getTime() - new Date(a.Date).getTime();
  });

  const resolvedCount = (student.riskInfo?.TotalRiskCount || 0) - (student.riskInfo?.UnresolvedRiskCount || 0);
  const unresolvedCount = student.riskInfo?.UnresolvedRiskCount || 0;

  const chartData = {
    labels: [t('common.resolved'), t('common.unresolved')],
    datasets: [
      {
        data: [resolvedCount, unresolvedCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.2)',
          'rgba(239, 68, 68, 0.2)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = resolvedCount + unresolvedCount;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value}${t('common.cases')} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  const handleResolutionUpdate = async () => {
    if (!selectedRiskId || !resolutionComment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await fetchApi(`/students/${student.id}/risks/${selectedRiskId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          resolutionComment: resolutionComment.trim(),
        }),
      });

      setShowCommentModal(false);
      setSelectedRiskId(null);
      setResolutionComment('');
      
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('risk.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const CommentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{t('risk.enterResolution')}</h3>
            <button
              onClick={() => {
                setShowCommentModal(false);
                setSelectedRiskId(null);
                setResolutionComment('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              {t('risk.resolutionContent')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={resolutionComment}
              onChange={(e) => setResolutionComment(e.target.value)}
              placeholder={t('risk.resolutionPlaceholder')}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowCommentModal(false);
                setSelectedRiskId(null);
                setResolutionComment('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleResolutionUpdate}
              disabled={!resolutionComment.trim() || loading}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                resolutionComment.trim() && !loading
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? t('common.processing') : t('risk.markAsResolved')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavigationHeader 
        title={t('risk.management')}
        activeNavId="admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('risk.studentInfo')}</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{t('common.name')}: {student.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{t('risk.admissionDate')}: {student.admissionDate || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 rounded-full p-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('risk.parentInfo')}</h2>
            </div>
            {student.familyInfo?.parentName ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{t('common.name')}: {student.familyInfo.parentName}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('risk.noParentInfo')}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 rounded-full p-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{t('risk.status')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <div className="w-full max-w-[300px] mx-auto">
                <Pie data={chartData} options={chartOptions} />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {student.riskInfo?.TotalRiskCount || 0}
                </div>
                <div className="text-sm text-gray-500">{t('common.total')} {t('common.cases')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('risk.totalRisks')}</span>
                  <span className="text-xl font-semibold text-gray-800">
                    {student.riskInfo?.TotalRiskCount || 0}
                  </span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('risk.unresolvedRisks')}</span>
                  <span className="text-xl font-semibold text-red-600">
                    {student.riskInfo?.UnresolvedRiskCount || 0}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('risk.resolvedRisks')}</span>
                  <span className="text-xl font-semibold text-green-600">
                    {resolvedCount}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('risk.resolutionRate')}</span>
                  <span className="text-xl font-semibold text-blue-600">
                    {student.riskInfo?.TotalRiskCount
                      ? Math.round(
                          (resolvedCount / student.riskInfo.TotalRiskCount) *
                            100
                        )
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('risk.list')}</h2>
            </div>
            <div className="text-sm text-gray-500">
              {t('common.total')} {sortedRiskHistory.length}{t('common.cases')}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {sortedRiskHistory.map((risk: RiskHistory) => (
              <div
                key={risk.RiskId}
                className={`border rounded-lg p-4 ${
                  risk.Status === '00' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {risk.Status === '00' ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      <span className={`font-medium ${
                        risk.Status === '00' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {risk.Status === '00' ? t('common.unresolved') : t('common.resolved')}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">{risk.Date}</span>
                    </div>
                    <p className="text-gray-800 mb-2">{risk.Description}</p>
                    {risk.ResolutionComment && (
                      <div className="flex items-start gap-2 mt-3 bg-white rounded-lg p-3">
                        <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
                        <p className="text-gray-600 text-sm">{risk.ResolutionComment}</p>
                      </div>
                    )}
                  </div>
                  
                  {risk.Status === '00' && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedRiskId(risk.RiskId);
                          setShowCommentModal(true);
                        }}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('risk.markAsResolved')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sortedRiskHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {t('risk.noRisks')}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCommentModal && <CommentModal />}
    </div>
  );
}