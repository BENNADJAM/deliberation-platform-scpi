const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    me: `${API_URL}/auth/me`,
  },
  classes: {
    getAll: `${API_URL}/classes`,
    getById: (id) => `${API_URL}/classes/${id}`,
    getStudents: (id) => `${API_URL}/classes/${id}/students`,
    create: `${API_URL}/classes`,
    update: (id) => `${API_URL}/classes/${id}`,
    delete: (id) => `${API_URL}/classes/${id}`,
  },
  students: {
    getAll: `${API_URL}/students`,
    getById: (id) => `${API_URL}/students/${id}`,
    create: `${API_URL}/students`,
    update: (id) => `${API_URL}/students/${id}`,
    delete: (id) => `${API_URL}/students/${id}`,
  },
  deliberation: {
    process: (classId) => `${API_URL}/deliberation/${classId}`,
    results: `${API_URL}/deliberation/results`,
    export: (classId) => `${API_URL}/deliberation/${classId}/export`,
  },
  dashboard: {
    stats: `${API_URL}/dashboard/stats`,
  },
};