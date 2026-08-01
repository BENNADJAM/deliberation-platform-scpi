import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LEVELS } from '../utils/constants';

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    search: '',
    teacher: '',
  });

  // Charger toutes les classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger une classe spécifique
  const fetchClassById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors du chargement de la classe');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle classe
  const createClass = useCallback(async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      toast.success('Classe créée avec succès');
      await fetchClasses(); // Rafraîchir la liste
      return response.data;
    } catch (error) {
      toast.error('Erreur lors de la création de la classe');
      return null;
    }
  }, [fetchClasses]);

  // Mettre à jour une classe
  const updateClass = useCallback(async (id, classData) => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      toast.success('Classe mise à jour avec succès');
      await fetchClasses(); // Rafraîchir la liste
      return response.data;
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la classe');
      return null;
    }
  }, [fetchClasses]);

  // Supprimer une classe
  const deleteClass = useCallback(async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      toast.success('Classe supprimée avec succès');
      await fetchClasses(); // Rafraîchir la liste
      return true;
    } catch (error) {
      toast.error('Erreur lors de la suppression de la classe');
      return false;
    }
  }, [fetchClasses]);

  // Archiver une classe
  const archiveClass = useCallback(async (id) => {
    try {
      await api.post(`/classes/${id}/archive`);
      toast.success('Classe archivée avec succès');
      await fetchClasses(); // Rafraîchir la liste
      return true;
    } catch (error) {
      toast.error('Erreur lors de l\'archivage de la classe');
      return false;
    }
  }, [fetchClasses]);

  // Restaurer une classe
  const restoreClass = useCallback(async (id) => {
    try {
      await api.post(`/classes/${id}/restore`);
      toast.success('Classe restaurée avec succès');
      await fetchClasses(); // Rafraîchir la liste
      return true;
    } catch (error) {
      toast.error('Erreur lors de la restauration de la classe');
      return false;
    }
  }, [fetchClasses]);

  // Filtrer les classes
  const filteredClasses = useCallback(() => {
    return classes.filter(cls => {
      const matchLevel = !filters.level || cls.level === filters.level;
      const matchSearch = !filters.search || 
        cls.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        cls.level.toLowerCase().includes(filters.search.toLowerCase());
      const matchTeacher = !filters.teacher || 
        cls.teacher?.toLowerCase().includes(filters.teacher.toLowerCase());
      return matchLevel && matchSearch && matchTeacher;
    });
  }, [classes, filters]);

  // Obtenir les statistiques des classes
  const getClassStats = useCallback(() => {
    const stats = {
      total: classes.length,
      byLevel: {},
      byStatus: { active: 0, archived: 0 },
    };
    
    classes.forEach(cls => {
      // Par niveau
      if (!stats.byLevel[cls.level]) {
        stats.byLevel[cls.level] = 0;
      }
      stats.byLevel[cls.level]++;
      
      // Par statut
      if (cls.archived) {
        stats.byStatus.archived++;
      } else {
        stats.byStatus.active++;
      }
    });
    
    return stats;
  }, [classes]);

  // Obtenir la liste des niveaux uniques
  const getUniqueLevels = useCallback(() => {
    const levels = new Set(classes.map(cls => cls.level));
    return LEVELS.filter(level => levels.has(level));
  }, [classes]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      level: '',
      search: '',
      teacher: '',
    });
  }, []);

  // Initialisation
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    // Données
    classes,
    filteredClasses: filteredClasses(),
    loading,
    error,
    filters,
    
    // Actions
    fetchClasses,
    fetchClassById,
    createClass,
    updateClass,
    deleteClass,
    archiveClass,
    restoreClass,
    setFilters,
    resetFilters,
    
    // Statistiques et utilitaires
    getClassStats: getClassStats(),
    getUniqueLevels: getUniqueLevels(),
    hasClasses: classes.length > 0,
    totalClasses: classes.length,
  };
};

export default useClasses;