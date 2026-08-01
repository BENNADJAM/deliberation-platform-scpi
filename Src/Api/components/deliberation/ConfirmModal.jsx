import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, isSubmitting, stats, modifiedCount }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-orange-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Confirmation</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Vous êtes sur le point de valider les résultats de délibération.
            Cette action est irréversible.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Élèves modifiés :</span>
              <span className="font-bold">{modifiedCount}</span>
              
              <span className="text-gray-600">Admis :</span>
              <span className="font-bold text-green-600">{stats.admis}</span>
              
              <span className="text-gray-600">Tangents :</span>
              <span className="font-bold text-orange-600">{stats.tangent}</span>
              
              <span className="text-gray-600">Redoublants :</span>
              <span className="font-bold text-red-600">{stats.redouble}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Validation...
                </div>
              ) : (
                'Valider'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;