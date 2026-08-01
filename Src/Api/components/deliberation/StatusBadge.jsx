import React from 'react';

const StatusBadge = ({ status, onStatusChange, isEditable = false }) => {
  const getStatusConfig = (status) => {
    const configs = {
      admis: {
        label: 'Admis',
        className: 'status-admis',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      redouble: {
        label: 'Redouble',
        className: 'status-redouble',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      tangent: {
        label: 'Tangent',
        className: 'status-tangent',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
      },
    };
    return configs[status] || configs.tangent;
  };

  const config = getStatusConfig(status);

  if (isEditable) {
    return (
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${config.bgColor} ${config.textColor}`}
      >
        <option value="admis">✅ Admis</option>
        <option value="tangent">⚠️ Tangent</option>
        <option value="redouble">❌ Redouble</option>
      </select>
    );
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;s