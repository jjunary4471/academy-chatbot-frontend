import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Student } from '../types';
import { 
  Search, 
  ArrowUpDown, 
  Flower2, 
  Apple, 
  Grape, 
  Laptop, 
  Clock 
} from 'lucide-react';
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

const PersonalityDisplay = ({ primaryType, secondaryType }: { primaryType?: string; secondaryType?: string }) => {
  if (!primaryType && !secondaryType) return null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {primaryType && getPersonalityIcon(primaryType)}
        <span className="text-sm">{primaryType}</span>
      </div>
      {secondaryType && (
        <>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-1">
            {getPersonalityIcon(secondaryType)}
            <span className="text-sm">{secondaryType}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const columnHelper = createColumnHelper<Student>();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/academies/${user.academyId}/students`);
        if (!response.ok) {
          throw new Error('학생 목록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user.academyId]);

  const columns = [
    columnHelper.accessor((row, index) => index, {
      id: 'index',
      header: 'No',
      cell: info => info.getValue() + 1,
    }),
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => {
        const student = students[info.row.index];
        return (
          <button 
            className="text-blue-600 hover:underline font-medium"
            onClick={() => navigate(`/student/${info.getValue()}/reports`, { state: { student } })}
          >
            {info.getValue()}
          </button>
        );
      },
    }),
    columnHelper.accessor('name', {
      header: '성명',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('admissionDate', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting()}
        >
          입학일
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('personalityResult', {
      header: '성격 유형',
      cell: info => {
        const result = info.getValue();
        if (!result || Object.keys(result).length === 0) {
          return <span className="text-gray-500">미실시</span>;
        }
        return (
          <PersonalityDisplay 
            primaryType={result.primaryType} 
            secondaryType={result.secondaryType} 
          />
        );
      },
    }),
  ];

  const table = useReactTable({
    data: students,
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
        <div className="text-blue-600">로딩중...</div>
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
            <h1 className="text-2xl font-bold text-gray-800">학생 관리</h1>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="학생 이름 또는 아이디로 검색..."
                className="w-full md:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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