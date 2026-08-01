import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { STATUSES, PASSING_AVERAGE, TANGENT_THRESHOLD } from '../utils/constants';

export const useDeliberation = (classId) => {
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    admis: 0,
    redouble: 0,
    tangent: 0,
  });

  // Charger les données de la classe
  const fetchClassData = useCallback(async () => {
    if (!classId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [classRes, studentsRes] = await Promise.all([
        api.get(`/classes/${classId}`),
        api.get(`/classes/${classId}/students`)
      ]);
      
      setClassInfo(classRes.data);
      
      // Ajouter des propriétés supplémentaires aux étudiants
      const studentsWithProps = studentsRes.data.map(student => ({
        ...student,
        selected: false,
        isModified: false,
        originalStatus: student.status,
        average: student.average || 0,
        fullName: `${student.firstName} ${student.lastName}`,
      }));
      
      setStudents(studentsWithProps);
      updateStats(studentsWithProps);
    } catch (error) {
      setError(error.message);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Mettre à jour les statistiques
  const updateStats = useCallback((studentsData) => {
    const newStats = {
      admis: 0,
      redouble: 0,
      tangent: 0,
    };
    
    studentsData.forEach(student => {
      if (student.status === STATUSES.ADMIS) newStats.admis++;
      else if (student.status === STATUSES.REDOUBLE) newStats.redouble++;
      else if (student.status === STATUSES.TANGENT) newStats.tangent++;
    });
    
    setStats(newStats);
  }, []);

  // Calculer le statut automatiquement basé sur la moyenne
  const calculateAutoStatus = useCallback((average) => {
    if (average >= PASSING_AVERAGE) return STATUSES.ADMIS;
    if (average >= TANGENT_THRESHOLD) return STATUSES.TANGENT;
    return STATUSES.REDOUBLE;
  }, []);

  // Changer le statut d'un étudiant
  const handleStatusChange = useCallback((studentId, newStatus) => {
    setStudents(prev => {
      const updated = prev.map(student => {
        if (student.id === studentId) {
          // Si le statut est tangent et la moyenne >= 10, on permet le changement
          // Sinon, on vérifie si le statut est valide
          const canChange = true; // On permet toujours le changement manuel
          if (canChange) {
            return {
              ...student,
              status: newStatus,
              isModified: true,
              finalDecision: newStatus,
            };
          }
          return student;
        }
        return student;
      });
      
      updateStats(updated);
      return updated;
    });
  }, [updateStats]);

  // Changer le statut en masse
  const handleBulkStatusChange = useCallback((status) => {
    if (!status) return;
    
    setStudents(prev => {
      const updated = prev.map(student => {
        if (student.selected) {
          return {
            ...student,
            status: status,
            isModified: true,
            finalDecision: status,
          };
        }
        return student;
      });
      
      updateStats(updated);
      return updated;
    });
    
    toast.success(`Statut modifié pour les élèves sélectionnés`);
  }, [updateStats]);

  // Sélectionner un étudiant
  const handleSelectStudent = useCallback((studentId) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  }, []);

  // Sélectionner tous les étudiants
  const handleSelectAll = useCallback(() => {
    setStudents(prev => {
      const allSelected = prev.every(s => s.selected);
      return prev.map(student => ({ ...student, selected: !allSelected }));
    });
  }, []);

  // Réinitialiser les modifications
  const handleReset = useCallback(() => {
    setStudents(prev =>
      prev.map(student => ({
        ...student,
        status: student.originalStatus || student.status,
        isModified: false,
        selected: false,
      }))
    );
    toast('Modifications annulées', { icon: '↩️' });
  }, []);

  // Sauvegarder les modifications
  const handleSave = useCallback(async () => {
    const modifiedStudents = students.filter(s => s.isModified);
    if (modifiedStudents.length === 0) {
      toast.error('Aucune modification à sauvegarder');
      return false;
    }

    setSubmitting(true);
    
    try {
      const response = await api.post(`/classes/${classId}/deliberate`, {
        students: modifiedStudents.map(s => ({
          id: s.id,
          status: s.status,
          finalDecision: s.finalDecision || s.status,
        })),
      });
      
      // Mettre à jour les étudiants avec les données du serveur
      setStudents(prev =>
        prev.map(student => {
          const updated = response.data.students.find(s => s.id === student.id);
          if (updated) {
            return {
              ...student,
              ...updated,
              isModified: false,
              originalStatus: updated.status,
            };
          }
          return student;
        })
      );
      
      toast.success('Délibération sauvegardée avec succès !');
      return true;
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [students, classId]);

  // Exporter les résultats
  const handleExport = useCallback(async (format = 'csv') => {
    try {
      const response = await api.get(`/deliberation/${classId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `deliberation_${classInfo?.name}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Exportation réussie');
    } catch (error) {
      toast.error('Erreur lors de l\'exportation');
    }
  }, [classId, classInfo]);

  // Imprimer les résultats
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Valider définitivement les résultats
  const handleValidate = useCallback(async () => {
    const modifiedStudents = students.filter(s => s.isModified);
    if (modifiedStudents.length === 0) {
      toast.error('Aucune modification à valider');
      return false;
    }

    setSubmitting(true);
    
    try {
      await api.post(`/deliberation/${classId}/validate`, {
        students: modifiedStudents.map(s => ({
          id: s.id,
          status: s.status,
          finalDecision: s.finalDecision || s.status,
        })),
      });
      
      toast.success('Résultats validés définitivement !');
      
      // Recharger les données
      await fetchClassData();
      return true;
    } catch (error) {
      toast.error('Erreur lors de la validation');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [students, classId, fetchClassData]);

  // Obtenir les statistiques détaillées
  const getDetailedStats = useCallback(() => {
    const total = students.length || 1;
    return {
      ...stats,
      total,
      successRate: Math.round((stats.admis / total) * 100),
      failureRate: Math.round(((stats.redouble + stats.tangent) / total) * 100),
    };
  }, [students, stats]);

  // Vérifier si des modifications sont en attente
  const hasPendingChanges = useCallback(() => {
    return students.some(s => s.isModified);
  }, [students]);

  // Obtenir le nombre d'étudiants modifiés
  const getModifiedCount = useCallback(() => {
    return students.filter(s => s.isModified).length;
  }, [students]);

  // Réinitialiser les sélections
  const clearSelection = useCallback(() => {
    setStudents(prev =>
      prev.map(student => ({ ...student, selected: false }))
    );
  }, []);

  // Initialisation
  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  // Retourner toutes les fonctions et données
  return {
    // Données
    students,
    classInfo,
    loading,
    submitting,
    error,
    stats: getDetailedStats(),
    
    // Actions de base
    handleStatusChange,
    handleBulkStatusChange,
    handleSelectStudent,
    handleSelectAll,
    handleReset,
    handleSave,
    handleExport,
    handlePrint,
    handleValidate,
    
    // Utilitaires
    hasPendingChanges: hasPendingChanges(),
    modifiedCount: getModifiedCount(),
    clearSelection,
    refresh: fetchClassData,
    
    // Calculs
    calculateAutoStatus,
  };
};

export default useDeliberation;