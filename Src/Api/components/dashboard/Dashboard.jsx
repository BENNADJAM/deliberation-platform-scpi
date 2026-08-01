import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaClock,
  FaChartLine,
  FaGraduationCap,
  FaUserGraduate,
  FaPercentage,
  FaCalendarAlt,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaStar,
  FaUserFriends,
  FaSchool,
  FaTrophy
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import StatCard from './StatCard';
import Charts from './Charts';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { STATUSES, STATUS_LABELS } from '../../utils/constants';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Dashboard = ({ 
  user, 
  stats: initialStats = null,
  loading: initialLoading = false,
  onRefresh
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // États
  const [stats, setStats] = useState(initialStats || {
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    admissionRate: 0,
    pendingDeliberations: 0,
    completedDeliberations: 0,
    classesByLevel: {},
    recentActivities: [],
    topStudents: [],
    classStats: [],
    monthlyStats: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(initialLoading);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('bar');

  // Charger les données du dashboard
  useEffect(() => {
    if (!initialStats) {
      fetchDashboardData();
    }
  }, [initialStats]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques détaillées
  const detailedStats = useMemo(() => {
    const total = stats.totalStudents || 0;
    const admis = stats.admisCount || 0;
    const redouble = stats.redoubleCount || 0;
    const tangent = stats.tangentCount || 0;
    
    return {
      total,
      admis,
      redouble,
      tangent,
      successRate: total > 0 ? Math.round((admis / total) * 100) : 0,
      failureRate: total > 0 ? Math.round(((redouble + tangent) / total) * 100) : 0,
    };
  }, [stats]);

  // Préparer les données pour les graphiques
  const chartData = useMemo(() => {
    if (stats.classesByLevel && Object.keys(stats.classesByLevel).length > 0) {
      return stats.classesByLevel;
    }
    
    // Données de démonstration si aucune donnée réelle
    return {
      '6ème': 45,
      '5ème': 38,
      '4ème': 42,
      '3ème': 40,
      'Seconde': 35,
      'Première': 30,
      'Terminale': 28,
    };
  }, [stats.classesByLevel]);

  // Préparer les données des activités récentes
  const recentActivities = useMemo(() => {
    if (stats.recentActivities && stats.recentActivities.length > 0) {
      return stats.recentActivities;
    }
    
    // Activités de démonstration
    return [
      {
        id: 1,
        type: 'deliberation',
        description: 'Délibération de la classe 3ème A terminée',
        date: new Date().toISOString(),
        user: 'Dr. Diallo',
      },
      {
        id: 2,
        type: 'student',
        description: 'Nouvel élève inscrit en 6ème',
        date: new Date(Date.now() - 3600000).toISOString(),
        user: 'Mme. Sow',
      },
      {
        id: 3,
        type: 'class',
        description: 'Création de la classe Seconde C',
        date: new Date(Date.now() - 7200000).toISOString(),
        user: 'M. Ndiaye',
      },
    ];
  }, [stats.recentActivities]);

  // Cartes de statistiques
  const statCards = [
    {
      id: 'students',
      title: 'Élèves',
      value: stats.totalStudents || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      subtitle: `${detailedStats.successRate}% de réussite`,
    },
    {
      id: 'classes',
      title: 'Classes',
      value: stats.totalClasses || 0,
      icon: FaChalkboardTeacher,
      color: 'bg-purple-500',
      change: '6 à Terminale',
      subtitle: `${stats.totalTeachers || 0} professeurs`,
    },
    {
      id: 'success',
      title: 'Taux de Réussite',
      value: `${detailedStats.successRate}%`,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      change: `${detailedStats.admis} admis`,
      subtitle: `${detailedStats.failureRate}% d'échec`,
    },
    {
      id: 'pending',
      title: 'Délibérations',
      value: stats.pendingDeliberations || 0,
      icon: FaClock,
      color: 'bg-orange-500',
      change: `${stats.completedDeliberations || 0} terminées`,
      subtitle: 'En cours',
    },
  ];

  // Classes par niveau
  const classCards = useMemo(() => {
    const levels = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'];
    return levels.map(level => ({
      level,
      count: stats.classesByLevel?.[level] || 0,
      color: level === '6ème' ? 'bg-blue-100 text-blue-800' :
             level === '5ème' ? 'bg-green-100 text-green-800' :
             level === '4ème' ? 'bg-yellow-100 text-yellow-800' :
             level === '3ème' ? 'bg-orange-100 text-orange-800' :
             level === 'Seconde' ? 'bg-purple-100 text-purple-800' :
             level === 'Première' ? 'bg-indigo-100 text-indigo-800' :
             'bg-red-100 text-red-800',
    }));
  }, [stats.classesByLevel]);

  // Meilleurs élèves
  const topStudents = useMemo(() => {
    if (stats.topStudents && stats.topStudents.length > 0) {
      return stats.topStudents;
    }
    
    // Données de démonstration
    return [
      { id: 1, name: 'Aliou Diallo', average: 18.5, class: 'Terminale A' },
      { id: 2, name: 'Fatou Sow', average: 17.8, class: 'Première B' },
      { id: 3, name: 'Moussa Ndiaye', average: 17.2, class: 'Seconde A' },
      { id: 4, name: 'Aminata Ba', average: 16.9, class: '3ème C' },
      { id: 5, name: 'Ibrahima Fall', average: 16.5, class: '4ème A' },
    ];
  }, [stats.topStudents]);

  // Alertes
  const alerts = useMemo(() => {
    if (stats.alerts && stats.alerts.length > 0) {
      return stats.alerts;
    }
    
    // Alertes de démonstration
    return [
      {
        id: 1,
        type: 'warning',
        message: '3 élèves en situation d\'échec en 3ème A',
        time: 'Il y a 2 heures',
      },
      {
        id: 2,
        type: 'info',
        message: 'Délibération de la 6ème B prévue demain',
        time: 'Il y a 4 heures',
      },
      {
        id: 3,
        type: 'success',
        message: 'Taux de réussite en hausse de 5% ce trimestre',
        time: 'Il y a 1 jour',
      },
    ];
  }, [stats.alerts]);

  // Gérer le rafraîchissement
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      await fetchDashboardData();
    }
    toast.success('Données actualisées');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tableau de Bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble de la plateforme de délibération
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="inline mr-1" />
            {formatDate(new Date())}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <FaDownload className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Répartition par Niveau
            </h3>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="input-field w-auto py-1 text-sm"
            >
              <option value="bar">Histogramme</option>
              <option value="pie">Camembert</option>
            </select>
          </div>
          <Charts type={selectedChart} data={chartData} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Top 5 des Meilleurs Élèves
            </h3>
            <FaTrophy className="text-yellow-500 text-xl" />
          </div>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-orange-500' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{student.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.class}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {student.average}/20
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Classes par niveau */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Classes par Niveau
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {stats.totalClasses || 0} classes
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {classCards.map((item) => (
            <div key={item.level} className={`p-4 rounded-lg text-center ${item.color}`}>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm font-medium">{item.level}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activités récentes et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Activités Récentes
            </h3>
            <FaClock className="text-gray-400" />
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  activity.type === 'deliberation' ? 'bg-green-500' :
                  activity.type === 'student' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(activity.date)}
                    </span>
                    {activity.user && (
                      <span className="text-xs text-primary-600 dark:text-primary-400">
                        par {activity.user}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Alertes
            </h3>
            <FaBell className="text-yellow-500" />
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                alert.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <p className="text-sm text-gray-800 dark:text-gray-200">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;