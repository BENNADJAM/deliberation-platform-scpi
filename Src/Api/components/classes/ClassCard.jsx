import React from 'react';
import { FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

const ClassCard = ({ classData }) => {
  const getLevelColor = (level) => {
    const colors = {
      '6ème': 'bg-blue-100 text-blue-800',
      '5ème': 'bg-green-100 text-green-800',
      '4ème': 'bg-yellow-100 text-yellow-800',
      '3ème': 'bg-orange-100 text-orange-800',
      'Seconde': 'bg-purple-100 text-purple-800',
      'Première': 'bg-indigo-100 text-indigo-800',
      'Terminale': 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{classData.name}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getLevelColor(classData.level)}`}>
            {classData.level}
          </span>
        </div>
        <div className="bg-primary-50 p-2 rounded-lg">
          <FaChalkboardTeacher className="text-primary-600" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaUsers />
          <span>{classData.studentCount || 0} élèves</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🏫 {classData.teacher || 'Professeur non assigné'}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Taux réussite</span>
            <span className="font-bold text-green-600">
              {classData.successRate || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${classData.successRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button 
        className="mt-4 w-full btn-primary text-center"
        onClick={(e) => {
          e.stopPropagation();
          // Navigation vers la délibération
        }}
      >
        Accéder à la classe
      </button>
    </div>
  );
};

export default ClassCard;