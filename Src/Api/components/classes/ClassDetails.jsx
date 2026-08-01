import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCog,
  FaDownload,
  FaPrint,
  FaEdit,
  FaTrash,
  FaArchive,
  FaTrashRestore,
  FaGraduationCap,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaStar,
  FaTrophy,
  FaMedal,
  FaAward,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileExport,
  FaEye
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { STATUSES, STATUS_LABELS, LEVELS } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ClassDetails = ({
  classData,
  students = [],
  loading = false,
  onBack,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onExport,
  onPrint,
  onStartDeliberation,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  className = '',
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // États
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = students.length;
    const admis = students.filter(s => s.status === STATUSES.ADMIS).length;
    const redouble = students.filter(s => s.status === STATUSES.REDOUBLE).length;
    const tangent = students.filter(s => s.status === STATUSES.TANGENT).length;
    const avecMoyenne = students.filter(s => s.average !== undefined && s.average !== null);
    const moyenneGenerale = avecMoyenne.length > 0 
      ? avecMoyenne.reduce((sum, s) => sum + s.average, 0) / avecMoyenne.length 
      : 0;
    
    // Meilleurs élèves
    const sortedStudents = [...students].sort((a, b) => (b.average || 0) - (a.average || 0));
    const topStudents = sortedStudents.slice(0, 5);

    // Répartition par statut
    const statusDistribution = {
      [STATUSES.ADMIS]: admis,
      [STATUSES.REDOUBLE]: redouble,
      [STATUSES.TANGENT]: tangent,
    };

    return {
      total,
      admis,
      redouble,
      tangent,
      moyenneGenerale,
      topStudents,
      statusDistribution,
      successRate: total > 0 ? Math.round((admis / total) * 100) : 0,
      failureRate: total > 0 ? Math.round(((redouble + tangent) / total) * 100) : 0,
      hasStudents: total > 0,
    };
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
        student.email?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      result = result.filter(student => student.status === filterStatus);
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
  }, [students, searchTerm, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Obtenir la couleur du niveau
  const getLevelColor = (level) => {
    const colors = {
      '6ème': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      '5ème': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      '4ème': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      '3ème': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'Seconde': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'Première': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
      'Terminale': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  };

  // Rendu du badge de statut
  const renderStatusBadge = (status) => {
    const configs = {
      [STATUSES.ADMIS]: {
        label: 'Admis',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        icon: <FaCheckCircle className="text-green-600 dark:text-green-400" />
      },
      [STATUSES.REDOUBLE]: {
        label: 'Redouble',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        icon: <FaTimesCircle className="text-red-600 dark:text-red-400" />
      },
      [STATUSES.TANGENT]: {
        label: 'Tangent',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        icon: <FaExclamationTriangle className="text-orange-600 dark:text-orange-400" />
      }
    };

    const config = configs[status] || configs[STATUSES.TANGENT];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Onglets
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <FaChartBar /> },
    { id: 'students', label: 'Élèves', icon: <FaUsers /> },
    { id: 'stats', label: 'Statistiques', icon: <FaGraduationCap /> },
  ];

  // Rendu de l'onglet Vue d'ensemble
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Informations générales
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Nom</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">{classData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Niveau</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(classData?.level)}`}>
                {classData?.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Professeur</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {classData?.teacher || 'Non assigné'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Salle</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {classData?.room || 'Non spécifiée'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Statut</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                classData?.archived 
                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100'
              }`}>
                {classData?.archived ? 'Archivée' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Statistiques rapides
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total élèves</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taux réussite</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.successRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Moyenne générale</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.moyenneGenerale ? stats.moyenneGenerale.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admis</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.admis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des statuts */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Répartition des statuts
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.admis}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Admis</div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.admis / stats.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.tangent}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tangents</div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.tangent / stats.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.redouble}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Redoublants</div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.redouble / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meilleurs élèves */}
      {stats.topStudents.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Meilleurs élèves
          </h4>
          <div className="space-y-3">
            {stats.topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-orange-500' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{student.fullName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {student.average ? student.average.toFixed(2) : 'N/A'}
                  </span>
                  {renderStatusBadge(student.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Rendu de l'onglet Élèves
  const renderStudents = () => (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4">
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-auto py-1 text-sm"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="input-field w-auto py-1 text-sm"
        >
          <option value={5}>5 par page</option>
          <option value={10}>10 par page</option>
          <option value={20}>20 par page</option>
          <option value={50}>50 par page</option>
        </select>
      </div>

      {/* Tableau des élèves */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    if (sortField === 'fullName') {
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('fullName');
                      setSortDirection('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Élève
                    {sortField === 'fullName' && (
                      sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Contact
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    if (sortField === 'average') {
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('average');
                      setSortDirection('asc');
                    }
                  }}
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {student.photo ? (
                            <img 
                              src={student.photo} 
                              alt={student.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {student.fullName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {student.phone && (
                          <div className="flex items-center gap-1">
                            <FaPhone className="text-xs text-gray-400" />
                            <span>{student.phone}</span>
                          </div>
                        )}
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewStudent && onViewStudent(student)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => onEditStudent && onEditStudent(student)}
                          className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${student.fullName} ?`)) {
                              onDeleteStudent && onDeleteStudent(student);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
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
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Rendu de l'onglet Statistiques
  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution des notes */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Distribution des notes
          </h4>
          <div className="space-y-3">
            {[
              { label: '18-20', color: 'bg-green-500', count: students.filter(s => s.average >= 18).length },
              { label: '16-17.99', color: 'bg-green-400', count: students.filter(s => s.average >= 16 && s.average < 18).length },
              { label: '14-15.99', color: 'bg-blue-400', count: students.filter(s => s.average >= 14 && s.average < 16).length },
              { label: '12-13.99', color: 'bg-yellow-400', count: students.filter(s => s.average >= 12 && s.average < 14).length },
              { label: '10-11.99', color: 'bg-orange-400', count: students.filter(s => s.average >= 10 && s.average < 12).length },
              { label: '0-9.99', color: 'bg-red-400', count: students.filter(s => s.average < 10).length },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Statistiques détaillées
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total élèves</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Moyenne générale</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.moyenneGenerale ? stats.moyenneGenerale.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Taux de réussite</span>
              <span className="font-medium text-green-600 dark:text-green-400">{stats.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Taux d'échec</span>
              <span className="font-medium text-red-600 dark:text-red-400">{stats.failureRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Admis</span>
              <span className="font-medium text-green-600 dark:text-green-400">{stats.admis}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Tangents</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">{stats.tangent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Redoublants</span>
              <span className="font-medium text-red-600 dark:text-red-400">{stats.redouble}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Chargement des détails..." />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏫</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Classe non trouvée
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          La classe que vous recherchez n'existe pas.
        </p>
        <button
          onClick={onBack}
          className="mt-4 btn-primary"
        >
          <FaArrowLeft className="inline mr-2" /> Retour
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {classData.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(classData.level)}`}>
                {classData.level}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {classData.teacher || 'Professeur non assigné'}
              </span>
              {classData.room && (
                <span className="text-gray-600 dark:text-gray-400">
                  Salle {classData.room}
                </span>
              )}
              {classData.archived && (
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                  Archivée
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!classData.archived && (
            <button
              onClick={onStartDeliberation}
              className="btn-success flex items-center gap-2"
            >
              <FaGraduationCap /> Délibérer
            </button>
          )}
          <button
            onClick={onEdit}
            className="btn-primary flex items-center gap-2"
          >
            <FaEdit /> Modifier
          </button>
          <button
            onClick={onExport}
            className="btn-primary flex items-center gap-2"
          >
            <FaDownload /> Exporter
          </button>
          <button
            onClick={onPrint}
            className="btn-primary flex items-center gap-2"
          >
            <FaPrint /> Imprimer
          </button>
          <button
            onClick={() => {
              if (classData.archived) {
                onRestore && onRestore();
              } else {
                onArchive && onArchive();
              }
            }}
            className={`btn-primary flex items-center gap-2 ${
              classData.archived ? 'bg-yellow-600 hover:bg-yellow-700' : ''
            }`}
          >
            {classData.archived ? <FaTrashRestore /> : <FaArchive />}
            {classData.archived ? 'Restaurer' : 'Archiver'}
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe ${classData.name} ?`)) {
                onDelete && onDelete();
              }
            }}
            className="btn-danger flex items-center gap-2"
          >
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'stats' && renderStats()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClassDetails;