import { PASSING_AVERAGE, TANGENT_THRESHOLD, STATUSES } from './constants';

export const calculateStatus = (average) => {
  if (average >= PASSING_AVERAGE) return STATUSES.ADMIS;
  if (average >= TANGENT_THRESHOLD) return STATUSES.TANGENT;
  return STATUSES.REDOUBLE;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} à ${formatTime(date)}`;
};

export const getStatusColor = (status) => {
  const colors = {
    [STATUSES.ADMIS]: 'text-green-600 bg-green-100',
    [STATUSES.REDOUBLE]: 'text-red-600 bg-red-100',
    [STATUSES.TANGENT]: 'text-orange-600 bg-orange-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

export const getStatusIcon = (status) => {
  const icons = {
    [STATUSES.ADMIS]: '✅',
    [STATUSES.REDOUBLE]: '❌',
    [STATUSES.TANGENT]: '⚠️',
  };
  return icons[status] || '❓';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'string') {
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return ascending ? aVal - bVal : bVal - aVal;
  });
};