import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaPrint, FaFileExport } from 'react-icons/fa';
import Layout from '../components/common/Layout';
import DeliberationTable from '../components/deliberation/DeliberationTable';
import ConfirmModal from '../components/deliberation/ConfirmModal';
import api from '../api/axios';

const DeliberationPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const [classRes, studentsRes] = await Promise.all([
        api.get(`/classes/${classId}`),
        api.get(`/classes/${classId}/students`)
      ]);
      setClassInfo(classRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, status: newStatus, isModified: true }
          : student
      )
    );
  };

  const handleBulkStatusChange = (status) => {
    setStudents(prev =>
      prev.map(student =>
        student.selected
          ? { ...student, status, isModified: true }
          : student
      )
    );
    setSelectedStudents([]);
  };

  const handleSelectStudent = (studentId) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = students.every(s => s.selected);
    setStudents(prev =>
      prev.map(student => ({ ...student, selected: !allSelected }))
    );
  };

  const handleSave = async () => {
    const modifiedStudents = students.filter(s => s.isModified);
    if (modifiedStudents.length === 0) {
      toast.error('Aucune modification à sauvegarder');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setIsSubmitting(true);
    try {
      const modifiedStudents = students.filter(s => s.isModified);
      await api.post(`/classes/${classId}/deliberate`, {
        students: modifiedStudents
      });
      toast.success('Délibération sauvegardée avec succès !');
      setShowConfirmModal(false);
      fetchClassData(); // Rafraîchir les données
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStats = () => {
    const stats = { admis: 0, redouble: 0, tangent: 0 };
    students.forEach(s => {
      if (s.status === 'admis') stats.admis++;
      else if (s.status === 'redouble') stats.redouble++;
      else if (s.status === 'tangent') stats.tangent++;
    });
    return stats;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  const stats = getStatusStats();

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/classes/${classId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Délibération - {classInfo?.name}
              </h1>
              <p className="text-gray-600">
                {classInfo?.level} • {students.length} élèves
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-success flex items-center gap-2" onClick={handleSave}>
              <FaSave /> Sauvegarder
            </button>
            <button className="btn-primary flex items-center gap-2">
              <FaPrint /> Imprimer
            </button>
            <button className="btn-primary flex items-center gap-2">
              <FaFileExport /> Exporter
            </button>
          </div>
        </div>

        {/* Statistiques de délibération */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Admis</span>
              <span className="text-2xl font-bold text-green-700">{stats.admis}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.admis / students.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-orange-700 font-medium">Tangents</span>
              <span className="text-2xl font-bold text-orange-700">{stats.tangent}</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${(stats.tangent / students.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-medium">Redoublants</span>
              <span className="text-2xl font-bold text-red-700">{stats.redouble}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${(stats.redouble / students.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tableau de délibération */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-0 overflow-hidden"
        >
          <DeliberationTable
            students={students}
            onStatusChange={handleStatusChange}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
            onBulkStatusChange={handleBulkStatusChange}
          />
        </motion.div>

        {/* Modal de confirmation */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmSave}
          isSubmitting={isSubmitting}
          stats={stats}
          modifiedCount={students.filter(s => s.isModified).length}
        />
      </div>
    </Layout>
  );
};

export default DeliberationPage;