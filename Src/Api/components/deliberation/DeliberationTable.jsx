import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import StudentRow from './StudentRow';

const DeliberationTable = ({ 
  students, 
  onStatusChange, 
  onSelectStudent, 
  onSelectAll,
  onBulkStatusChange 
}) => {
  const data = React.useMemo(() => students, [students]);
  
  const columns = React.useMemo(() => [
    {
      Header: 'Sélection',
      id: 'selection',
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.selected || false}
          onChange={() => onSelectStudent(row.original.id)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      Header: 'N°',
      accessor: 'id',
      Cell: ({ row }) => <span className="text-gray-500">{row.index + 1}</span>,
    },
    {
      Header: 'Nom & Prénom',
      accessor: 'fullName',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.fullName}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      Header: 'Moyenne',
      accessor: 'average',
      Cell: ({ value }) => (
        <span className={`font-bold ${
          value >= 10 ? 'text-green-600' : 
          value >= 9.5 ? 'text-orange-500' : 
          'text-red-600'
        }`}>
          {value.toFixed(2)}
        </span>
      ),
      sortType: 'basic',
    },
    {
      Header: 'Statut',
      accessor: 'status',
      Cell: ({ row }) => (
        <StatusBadge 
          status={row.original.status} 
          onStatusChange={(newStatus) => onStatusChange(row.original.id, newStatus)}
          isEditable={true}
        />
      ),
    },
    {
      Header: 'Décision Finale',
      accessor: 'finalDecision',
      Cell: ({ row }) => (
        <StatusBadge 
          status={row.original.finalDecision || row.original.status}
          onStatusChange={(newStatus) => onStatusChange(row.original.id, newStatus)}
          isEditable={true}
        />
      ),
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            className="text-sm text-primary-600 hover:text-primary-800"
            onClick={() => onStatusChange(row.original.id, 'admis')}
          >
            Admettre
          </button>
          <button 
            className="text-sm text-red-600 hover:text-red-800"
            onClick={() => onStatusChange(row.original.id, 'redouble')}
          >
            Faire redoubler
          </button>
        </div>
      ),
    },
  ], [onStatusChange, onSelectStudent]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    pageCount,
    setPageSize,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="overflow-x-auto">
      {/* Barre d'outils */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Actions groupées:</span>
          <select
            onChange={(e) => onBulkStatusChange(e.target.value)}
            className="input-field w-auto py-1 text-sm"
            defaultValue=""
          >
            <option value="">Choisir...</option>
            <option value="admis">Admettre tous</option>
            <option value="redouble">Faire redoubler tous</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, data.length)} sur {data.length}
          </span>
        </div>
      </div>

      {/* Tableau */}
      <table {...getTableProps()} className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    {column.render('Header')}
                    {column.canSort && (
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? <FaSortDown /> : <FaSortUp />
                        ) : (
                          <FaSort className="text-gray-300" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </