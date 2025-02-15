import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  Search, 
  ArrowUpDown, 
  Flower2, 
  Apple, 
  Grape,
  Laptop, 
  Clock,
  AlertTriangle,
  AlertCircle,
  Cherry,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types';
import UserHeader from './UserHeader';
import { useLocale } from '../contexts/LocaleContext';

const getPersonalityIcon = (type: string) => {
  switch (type) {
    case 'さくら':
    case '사쿠라':
      return <Flower2 className="w-4 h-4 text-pink-400" aria-label="사쿠라" />;
    case 'うめ':
    case '우메':
      return <Cherry className="w-4 h-4 text-red-400" aria-label="우메" />;
    case 'もも':
    case '모모':
      return <Apple className="w-4 h-4 text-orange-400" aria-label="모모" />;
    case 'すもも':
    case '스모모':
      return <Grape className="w-4 h-4 text-purple-400" aria-label="스모모" />;
    case 'デジタル':
    case '디지털':
      return <Laptop className="w-4 h-4 text-blue-400" aria-label="디지털" />;
    case 'アナログ':
    case '아날로그':
      return <Clock className="w-4 h-4 text-gray-400" aria-label="아날로그" />;
    default:
      return null;
  }
};

const PersonalityDisplay = ({ student }: { student: Student }) => {
  const navigate = useNavigate();
  
  if (!student.personalityResult?.primaryType && !student.personalityResult?.secondaryType) 
    return <span className="text-gray-500">미실시</span>;
  
  return (
    <button 
      onClick={() => navigate(`/student/${student.id}/reports`, { state: { student } })}
      className="flex items-center gap-2 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
    >
      <div className="flex items-center gap-1">
        {student.personalityResult.primaryType && getPersonalityIcon(student.personalityResult.primaryType)}
        <span className="text-sm">{student.personalityResult.primaryType}</span>
      </div>
      {student.personalityResult.secondaryType && (
        <>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-1">
            {getPersonalityIcon(student.personalityResult.secondaryType)}
            <span className="text-sm">{student.personalityResult.secondaryType}</span>
          </div>
        </>
      )}
    </button>
  );
};

const RiskFactorDisplay = ({ student }: { student: Student }) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { UnresolvedRiskCount = 0, TotalRiskCount = 0, RiskHistory = [] } = student.riskInfo || {};

  const getLatestRisk = () => {
    if (!RiskHistory.length) return null;
    return RiskHistory.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())[0];
  };

  const latestRisk = getLatestRisk();

  return (
    <button
      onClick={() => navigate(`/student/${student.id}/risk-factors`, { state: { student } })}
      className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1 rounded-full transition-colors group"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className={`w-4 h-4 ${UnresolvedRiskCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
        <span>
          <span className={`font-medium ${UnresolvedRiskCount > 0 ? 'text-red-500' : 'text-gray-600'}`}>
            {UnresolvedRiskCount}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{TotalRiskCount}</span>
        </span>
      </div>
      {latestRisk && (
        <div className="hidden group-hover:block ml-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {latestRisk.Status === '01' ? (
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-500" />
            )}
            <span className="truncate max-w-[200px]">{latestRisk.Description}</span>
          </div>
        </div>
      )}
    </button>
  );
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const columnHelper = createColumnHelper<Student>();
  const { t } = useLocale();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/academies/${user.academyId}/students`);
        if (!response.ok) {
          throw new Error(t('common.noData'));
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.noData'));
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user.academyId, t]);

  const filteredData = React.useMemo(() => {
    return students.filter(student => {
      if (showUnresolvedOnly) {
        return (student.riskInfo?.UnresolvedRiskCount || 0) > 0;
      }
      return true;
    });
  }, [students, showUnresolvedOnly]);

  const columns = [
    columnHelper.accessor((row, index) => index, {
      id: 'index',
      header: 'No',
      cell: info => info.getValue() + 1,
    }),
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => (
        <button
          onClick={() => navigate(`/student/${info.getValue()}/reports`, { state: { student: info.row.original } })}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('name', {
      header: t('common.name'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('admissionDate', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting()}
        >
          {t('auth.signup.admissionDate')}
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('personalityResult', {
      header: t('personality.test.title'),
      cell: info => {
        const student = info.row.original;
        return <PersonalityDisplay student={student} />;
      },
    }),
    columnHelper.accessor(row => row, {
      id: 'riskFactors',
      header: t('risk.management'),
      cell: info => <RiskFactorDisplay student={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-600">{t('common.processing')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.admin.title')}</h1>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder={t('dashboard.search.placeholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showUnresolvedOnly}
                  onChange={e => setShowUnresolvedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">{t('dashboard.filter.unresolvedOnly')}</span>
                </div>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-200">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}