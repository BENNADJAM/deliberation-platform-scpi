import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaSortUp, 
  FaSortDown,
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
  FaDownload,
  FaUpload
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StudentList = ({
  students = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  onExport,
  onImport,
  className = '',
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // États de filtrage et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Extraire les classes uniques
  const uniqueClasses = useMemo(() => {
    const classes = new Set();
    students.forEach(student => {
      if (student.className) {
        classes.add(student.className);
      }
    });
    return Array.from(classes);
  }, [students]);

  // Filtrer et trier les étudiants
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(student =>
        student.fullName?.toLowerCase().includes(term) ||
        student.firstName?.toLowerCase().includes(term) ||
        student.lastName?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.className?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      result = result.filter(student => student.status === filterStatus);
    }

    // Filtre par classe
    if (filterClass !== 'all') {
      result = result.filter(student => student.className === filterClass);
    }

    // Tri
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, filterStatus, filterClass, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Gestion du tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gestion des actions groupées
  const handleBulkAction = (action) => {
    if (selectedStudents.length === 0) {
      toast.error('Veuillez sélectionner au moins un élève');
      return;
    }

    if (onBulkAction) {
      onBulkAction(action, selectedStudents);
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = students.length;
    const admis = students.filter(s => s.status === 'admis').length;
    const redouble = students.filter(s => s.status === 'redouble').length;
    const tangent = students.filter(s => s.status === 'tangent').length;
    
    return {
      total,
      admis,
      redouble,
      tangent,
      successRate: total > 0 ? Math.round((admis / total) * 100) : 0,
    };
  }, [students]);

  // Rendu du statut avec badge
  const renderStatusBadge = (status) => {
    const configs = {
      admis: {
        label: 'Admis',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        icon: <FaCheck className="text-green-600 dark:text-green-300" />
      },
      redouble: {
        label: 'Redouble',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        icon: <FaTimes className="text-red-600 dark:text-red-300" />
      },
      tangent: {
        label: 'Tangent',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        icon: <FaTimes className="text-orange-600 dark:text-orange-300" />
      }
    };

    const config = configs[status] || configs.tangent;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement des élèves...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👨‍🎓</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Aucun élève
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Aucun élève n'est enregistré dans le système.
        </p>
        <button
          onClick={onImport}
          className="mt-4 btn-primary flex items-center gap-2 mx-auto"
        >
          <FaUpload /> Importer des élèves
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow">
          <p className="text-sm text-green-600 dark:text-green-400">Admis</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.admis}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 shadow">
          <p className="text-sm text-red-600 dark:text-red-400">Redoublants</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.redouble}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 shadow">
          <p className="text-sm text-orange-600 dark:text-orange-400">Tangents</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.tangent}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow">
          <p className="text-sm text-blue-600 dark:text-blue-400">Taux réussite</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.successRate}%</p>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-auto py-1"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="input-field w-auto py-1"
            >
              <option value="all">Toutes les classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedStudents.length > 0 && (
            <>
              <button
                onClick={() => handleBulkAction('admis')}
                className="btn-success text-sm px-3 py-1"
              >
                Admettre
              </button>
              <button
                onClick={() => handleBulkAction('redouble')}
                className="btn-danger text-sm px-3 py-1"
              >
                Redoubler
              </button>
            </>
          )}
          <button
            onClick={onImport}
            className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
          >
            <FaUpload /> Importer
          </button>
          <button
            onClick={onExport}
            className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
          >
            <FaDownload /> Exporter
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-1">
                    Élève
                    {sortField === 'fullName' && (
                      sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('className')}
                >
                  <div className="flex items-center gap-1">
                    Classe
                    {sortField === 'className' && (
                      sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('average')}
                >
                  <div className="flex items-center gap-1">
                    Moyenne
                    {sortField === 'average' && (
                      sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {paginatedStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                          {student.photo ? (
                            <img 
                              src={student.photo} 
                              alt={student.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-primary-600 dark:text-primary-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {student.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email || 'Email non renseigné'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-gray-400" />
                        <span className="text-sm">{student.className || 'Non assigné'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        student.average >= 10 ? 'text-green-600 dark:text-green-400' :
                        student.average >= 9.5 ? 'text-orange-500 dark:text-orange-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {student.average ? student.average.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(student.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {student.phone && (
                          <span className="flex items-center gap-1">
                            <FaPhone className="text-xs" />
                            {student.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView && onView(student)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Voir"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(student)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${student.fullName} ?`)) {
                              onDelete && onDelete(student);
                            }
                          }}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} sur{' '}
              {filteredStudents.length} élèves
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              <span className="text-sm">
                Page {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Suivant
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="input-field w-auto py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;