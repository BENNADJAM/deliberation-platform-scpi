export const STATUSES = {
  ADMIS: 'admis',
  REDOUBLE: 'redouble',
  TANGENT: 'tangent',
};

export const STATUS_LABELS = {
  [STATUSES.ADMIS]: 'Admis',
  [STATUSES.REDOUBLE]: 'Redouble',
  [STATUSES.TANGENT]: 'Tangent',
};

export const STATUS_COLORS = {
  [STATUSES.ADMIS]: '#22c55e',
  [STATUSES.REDOUBLE]: '#ef4444',
  [STATUSES.TANGENT]: '#f97316',
};

export const LEVELS = [
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  'Seconde',
  'Première',
  'Terminale'
];

export const PASSING_AVERAGE = 10;
export const TANGENT_THRESHOLD = 9.5;

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  DIRECTOR: 'director',
};

export const API_ROUTES = {
  AUTH: '/auth',
  CLASSES: '/classes',
  STUDENTS: '/students',
  DELIBERATION: '/deliberation',
  DASHBOARD: '/dashboard',
};