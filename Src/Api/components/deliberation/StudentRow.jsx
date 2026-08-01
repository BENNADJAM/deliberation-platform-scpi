import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaEdit,
  FaSave,
  FaTimes as FaClose,
  FaUser,
  FaInfoCircle
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import StatusBadge from './StatusBadge';

const StudentRow = ({
  student,
  index,
  onStatusChange,
  onSelect,
  isSelected = false,
  isModified = false,
  showActions = true,
  onViewDetails,
  className = '',
}) => {
  const { colors, isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(student.status);

  // Calculer le statut basé sur la moyenne
  const getAutoStatus = (average) => {
    if (average >= 10) return STATUSES.ADMIS;
    if (average >= 9.5) return STATUSES.TANGENT;
    return STATUSES.REDOUBLE;
  };

  // Obtenir les informations de statut
  const getStatusInfo = (status) => {
    const info = {
      [STATUSES.ADMIS]: {
        label: 'Admis',
        icon: <FaCheck className="text-green-600 dark:text-green-400" />,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800',
      },
      [STATUSES.REDOUBLE]: {
        label: 'Redouble',
        icon: <FaTimes className="text-red-600 dark:text-red-400" />,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800',
      },
      [STATUSES.TANGENT]: {
        label: 'Tangent',
        icon: <FaExclamationTriangle className="text-orange-600 dark:text-orange-400" />,
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-300',
        borderColor: 'border-orange-200 dark:border-orange-800',
      },
    };
    return info[status] || info[STATUSES.TANGENT];
  };

  const autoStatus = getAutoStatus(student.average);
  const currentStatus = student.status || autoStatus;
  const statusInfo = getStatusInfo(currentStatus);
  const isDifferentFromAuto = currentStatus !== autoStatus;

  const handleStatusChange = (newStatus) => {
    setEditStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(student.id, newStatus);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditStatus(currentStatus);
    setIsEditing(false);
  };

  const handleRowClick = () => {
    if (onSelect) {
      onSelect(student.id);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      } ${isModified ? 'border-l-4 border-yellow-400' : ''} ${className}`}
      onClick={handleRowClick}
      style={{
        backgroundColor: isSelected ? colors.backgroundSecondary : undefined,
      }}
    >
      {/* Case à cocher */}
      <td className="px-4 py-3 w-12" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect && onSelect(student.id)}
          className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
        />
      </td>

      {/* Numéro */}
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {index + 1}
      </td>

      {/* Nom & Prénom */}
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
              {student.email || 'Email non renseigné'}
            </div>
          </div>
        </div>
      </td>

      {/* Moyenne */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${
            student.average >= 10 ? 'text-green-600 dark:text-green-400' :
            student.average >= 9.5 ? 'text-orange-500 dark:text-orange-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {student.average ? student.average.toFixed(2) : 'N/A'}
          </span>
          {student.average && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${
                  student.average >= 10 ? 'bg-green-500' :
                  student.average >= 9.5 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(student.average / 20) * 100}%` }}
              />
            </div>
          )}
        </div>
      </td>

      {/* Statut automatique */}
      <td className="px-4 py-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Automatique</span>
          <StatusBadge 
            status={autoStatus} 
            isEditable={false}
          />
        </div>
      </td>

      {/* Statut actuel / Édition */}
      <td className="px-4 py-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isModified ? '📝 Modifié' : 'Décision'}
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="input-field py-1 text-sm w-32"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              >
                <option value={STATUSES.ADMIS}>✅ Admis</option>
                <option value={STATUSES.TANGENT}>⚠️ Tangent</option>
                <option value={STATUSES.REDOUBLE}>❌ Redouble</option>
              </select>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(editStatus);
                }}
                className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                title="Valider"
              >
                <FaSave />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Annuler"
              >
                <FaClose />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <StatusBadge 
                status={currentStatus} 
                isEditable={false}
              />
              {isDifferentFromAuto && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400" title="Statut modifié manuellement">
                  ✏️
                </span>
              )}
              {showActions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setEditStatus(currentStatus);
                  }}
                  className="p-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  title="Modifier le statut"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          )}
        </div>
      </td>

      {/* Décision finale */}
      <td className="px-4 py-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Finale</span>
          <StatusBadge 
            status={student.finalDecision || currentStatus} 
            isEditable={false}
          />
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(student)}
              className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Voir les détails"
            >
              <FaInfoCircle />
            </button>
          )}
          {showActions && !isEditing && (
            <>
              <button
                onClick={() => handleStatusChange(STATUSES.ADMIS)}
                className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Admettre"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => handleStatusChange(STATUSES.REDOUBLE)}
                className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Faire redoubler"
              >
                <FaTimes />
              </button>
            </>
          )}
        </div>
      </td>

      {/* Indicateur de modification */}
      {isModified && (
        <td className="px-2 py-3 w-8">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" title="Modification en attente" />
        </td>
      )}
    </motion.tr>
  );
};

export default StudentRow;