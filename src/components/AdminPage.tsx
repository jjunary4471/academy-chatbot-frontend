import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Student } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';
import UserHeader from './UserHeader';

const mockStudents: Student[] = [
  { id: 1, userId: "student1", name: "김철수", enrollmentDate: "2024-01-15", studentType: "정규" },
  { id: 2, userId: "student2", name: "이영희", enrollmentDate: "2024-02-20", studentType: "특별" },
];

export default function AdminPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const columnHelper = createColumnHelper<Student>();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const columns = [
    columnHelper.accessor('id', {
      header: '번호',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('userId', {
      header: '아이디',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: '성명',
      cell: info => (
        <button 
          className="text-blue-600 hover:underline"
          onClick={() => alert(`학생 상세정보: ${info.getValue()}`)}
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('enrollmentDate', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting()}
        >
          입학일
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('studentType', {
      header: '학생타입',
      cell: info => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: mockStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">학생 관리</h1>
            <UserHeader name={user.name} role={user.role} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
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
              <thead className="bg-gray-50">
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
                  <tr key={row.id} className="hover:bg-gray-50">
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