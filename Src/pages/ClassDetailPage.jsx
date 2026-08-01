import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCog,
  FaDownload,
  FaPrint,
  FaEdit
} from 'react-icons/fa';
import Layout from '../components/common/Layout';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    successRate: 0,
    topStudent: null,
    bottomStudent: null,
  });

  useEffect(() => {
    fetchClassData();
  }, [id]);

  const fetchClassData = async () => {
    try {
      const [classRes, studentsRes, statsRes] = await Promise.all([
        api.get(`/classes/${id}`),
        api.get(`/classes/${id}/students`),
        api.get(`/classes/${id}/stats`)
      ]);
      setClassData(classRes.data);
      setStudents(studentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDeliberation = () => {
    navigate(`/deliberation/${id}`);
  };

  const handleExport = async () => {
    try {
      const response = await api.get(`/classes/${id}/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `classe_${classData.name}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Exportation réussie');
    } catch (error) {
      toast.error('Erreur lors de l\'exportation');
    }
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

  if (!classData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Classe non trouvée</p>
          <button 
            onClick={() => navigate('/classes')}
            className="btn-primary mt-4"
          >
            Retour aux classes
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/classes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{classData.name}</h1>
              <p className="text-gray-600">
                {classData.level} • {classData.teacher || 'Professeur non assigné'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              className="btn-success flex items-center gap-2"
              onClick={handleStartDeliberation}
            >
              <FaUserGraduate /> Délibérer
            </button>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={handleExport}
            >
              <FaDownload /> Exporter
            </button>
            <button className="btn-primary flex items-center gap-2">
              <FaPrint /> Imprimer
            </button>
            <button className="btn-primary flex items-center gap-2">
              <FaEdit /> Modifier
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Élèves</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaChartBar className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Moyenne générale</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.average ? stats.average.toFixed(2) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUserGraduate className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.successRate || 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaCog className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Délibération</p>
                <button 
                  onClick={handleStartDeliberation}
                  className="btn-primary text-sm mt-1"
                >
                  Démarrer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des élèves */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Liste des Élèves</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher un élève..."
                className="input-field py-1 text-sm w-48"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom & Prénom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moyenne</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{student.fullName}</td>
                    <td className="px-4 py-3 text-sm font-bold">
                      <span className={
                        student.average >= 10 ? 'text-green-600' :
                        student.average >= 9.5 ? 'text-orange-500' :
                        'text-red-600'
                      }>
                        {student.average ? student.average.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'admis' ? 'bg-green-100 text-green-800' :
                        student.status === 'redouble' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {student.status === 'admis' ? 'Admis' :
                         student.status === 'redouble' ? 'Redouble' :
                         'Tangent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        className="text-primary-600 hover:text-primary-800"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      Aucun élève dans cette classe
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {students.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>Total: {students.length} élèves</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50">Précédent</button>
                <button className="px-3 py-1 border rounded bg-primary-600 text-white">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">Suivant</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClassDetailPage;