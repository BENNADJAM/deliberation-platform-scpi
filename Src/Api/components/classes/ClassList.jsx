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
  FaPlus,
  FaChalkboardTeacher,
  FaUsers,
  FaGraduationCap,
  FaCalendarAlt,
  FaChartBar,
  FaDownload,
  FaUpload,
  FaArchive,
  FaTrashRestore,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaClock
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVELS, LEVEL_ORDER } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ClassList = ({
  classes = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onAdd,
  onExport,
  onImport,
  onBulkAction,
  className = '',
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [expandedClass, setExpandedClass] = useState(null);

  // Filtrer et trier les classes
  const filteredClasses = useMemo(() => {
    let result = [...classes];

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cls =>
        cls.name?.toLowerCase().includes(term) ||
        cls.level?.toLowerCase().includes(term) ||
        cls.teacher?.toLowerCase().includes(term) ||
        cls.room?.toLowerCase().includes(term)
      );
    }

    // Filtre par niveau
    if (filterLevel !== 'all') {
      result = result.filter(cls => cls.level === filterLevel);
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      const isArchived = filterStatus === 'archived';
      result = result.filter(cls => cls.archived === isArchived);
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
  }, [classes, searchTerm, filterLevel, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredClasses.slice(start, end);
  }, [filteredClasses, currentPage, itemsPerPage]);

  // Statistiques
  const stats = useMemo(() => {
    const total = classes.length;
    const active = classes.filter(c => !c.archived).length;
    const archived = classes.filter(c => c.archived).length;
    const byLevel = {};
    
    classes.forEach(cls => {
      if (!byLevel[cls.level]) {
        byLevel[cls.level] = 0;
      }
      byLevel[cls.level]++;
    });

    let totalStudents = 0;
    classes.forEach(cls => {
      totalStudents += cls.studentCount || 0;
    });

    return {
      total,
      active,
      archived,
      byLevel,
      totalStudents,
      averageStudents: total > 0 ? Math.round(totalStudents / total) : 0,
    };
  }, [classes]);

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (selectedClasses.length === paginatedClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(paginatedClasses.map(c => c.id));
    }
  };

  const handleSelectClass = (classId) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
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
    if (selectedClasses.length === 0) {
      toast.error('Veuillez sélectionner au moins une classe');
      return;
    }

    if (onBulkAction) {
      onBulkAction(action, selectedClasses);
    }
  };

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

  // Rendu en grille
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedClasses.map((cls, index) => (
        <motion.div
          key={cls.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
            selectedClasses.includes(cls.id) ? 'ring-2 ring-primary-500' : ''
          }`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(cls.id)}
                  onChange={() => handleSelectClass(cls.id)}
                  className="mt-1 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {cls.name}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getLevelColor(cls.level)}`}>
                    {cls.level}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {cls.archived && (
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                    Archivé
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaChalkboardTeacher className="text-gray-400" />
                <span>{cls.teacher || 'Professeur non assigné'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaUsers className="text-gray-400" />
                <span>{cls.studentCount || 0} élèves</span>
              </div>
              {cls.room && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaChalkboardTeacher className="text-gray-400" />
                  <span>Salle {cls.room}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Taux réussite</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {cls.successRate || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cls.successRate || 0}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => onView && onView(cls)}
                className="flex-1 btn-primary text-center text-sm py-2"
              >
                <FaEye className="inline mr-1" /> Voir
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit && onEdit(cls)}
                  className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    if (cls.archived) {
                      onRestore && onRestore(cls);
                    } else {
                      onArchive && onArchive(cls);
                    }
                  }}
                  className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                  title={cls.archived ? 'Restaurer' : 'Archiver'}
                >
                  {cls.archived ? <FaTrashRestore /> : <FaArchive />}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe ${cls.name} ?`)) {
                      onDelete && onDelete(cls);
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Rendu en liste
  const renderListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedClasses.length === paginatedClasses.length && paginatedClasses.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Classe
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => handleSort('level')}
              >
                <div className="flex items-center gap-1">
                  Niveau
                  {sortField === 'level' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => handleSort('teacher')}
              >
                <div className="flex items-center gap-1">
                  Professeur
                  {sortField === 'teacher' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => handleSort('studentCount')}
              >
                <div className="flex items-center gap-1">
                  Élèves
                  {sortField === 'studentCount' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => handleSort('successRate')}
              >
                <div className="flex items-center gap-1">
                  Réussite
                  {sortField === 'successRate' && (
                    sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {paginatedClasses.map((cls, index) => (
                <motion.tr
                  key={cls.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedClasses.includes(cls.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={() => handleSelectClass(cls.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{cls.name}</div>
                    {cls.archived && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Archivé</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cls.level)}`}>
                      {cls.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {cls.teacher || 'Non assigné'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {cls.studentCount || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {cls.successRate || 0}%
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${cls.successRate || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView && onView(cls)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(cls)}
                        className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (cls.archived) {
                            onRestore && onRestore(cls);
                          } else {
                            onArchive && onArchive(cls);
                          }
                        }}
                        className="p-1.5 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title={cls.archived ? 'Restaurer' : 'Archiver'}
                      >
                        {cls.archived ? <FaTrashRestore /> : <FaArchive />}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer la classe ${cls.name} ?`)) {
                            onDelete && onDelete(cls);
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
    </div>
  );

  // Composant de filtres
  const FilterBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 flex-wrap">
          <FaFilter className="text-gray-400" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="input-field w-auto py-1 text-sm"
          >
            <option value="all">Tous les niveaux</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto py-1 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="archived">Archivées</option>
          </select>
        </div>
      </div>

      {/* Actions et vue */}
      <div className="flex items-center gap-2">
        {selectedClasses.length > 0 && (
          <>
            <button
              onClick={() => handleBulkAction('archive')}
              className="btn-warning text-sm px-3 py-1 flex items-center gap-1"
            >
              <FaArchive /> Archiver
            </button>
          </>
        )}
        <button
          onClick={onAdd}
          className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
        >
          <FaPlus /> Nouvelle
        </button>
        <button
          onClick={onExport}
          className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
        >
          <FaDownload /> Exporter
        </button>
        <button
          onClick={onImport}
          className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
        >
          <FaUpload /> Importer
        </button>
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2 py-1 text-sm ${
              viewMode === 'grid' 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Vue en grille"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-1 text-sm ${
              viewMode === 'list' 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Vue en liste"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );

  // Statistiques
  const StatsBar = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow">
        <p className="text-sm text-green-600 dark:text-green-400">Actives</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 shadow">
        <p className="text-sm text-gray-600 dark:text-gray-400">Archivées</p>
        <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.archived}</p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow">
        <p className="text-sm text-blue-600 dark:text-blue-400">Élèves</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 shadow">
        <p className="text-sm text-purple-600 dark:text-purple-400">Moyenne/Classe</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageStudents}</p>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 shadow">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">Niveaux</p>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{Object.keys(stats.byLevel).length}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement des classes...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏫</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Aucune classe
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Aucune classe n'est enregistrée dans le système.
        </p>
        <button
          onClick={onAdd}
          className="mt-4 btn-primary flex items-center gap-2 mx-auto"
        >
          <FaPlus /> Créer une classe
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques */}
      <StatsBar />

      {/* Filtres et actions */}
      <FilterBar />

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredClasses.length} classe{filteredClasses.length > 1 ? 's' : ''} trouvée{filteredClasses.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {itemsPerPage} par page
            </span>
          </div>
        </div>

        {viewMode === 'grid' ? renderGridView() : renderListView()}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
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
};

export default ClassList;