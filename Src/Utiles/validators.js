/**
 * Validateurs pour les différents champs de l'application
 */

export const validators = {
  // Validation des emails
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'L\'email est requis';
    if (!re.test(email)) return 'Email invalide (ex: nom@domaine.com)';
    return null;
  },

  // Validation des mots de passe
  password: (password) => {
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir une majuscule';
    if (!/[a-z]/.test(password)) return 'Le mot de passe doit contenir une minuscule';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir un chiffre';
    if (!/[!@#$%^&*]/.test(password)) return 'Le mot de passe doit contenir un caractère spécial (!@#$%^&*)';
    return null;
  },

  // Validation des noms
  name: (name) => {
    if (!name) return 'Le nom est requis';
    if (name.length < 2) return 'Le nom doit contenir au moins 2 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) return 'Le nom contient des caractères invalides';
    return null;
  },

  // Validation des prénoms
  firstName: (firstName) => {
    if (!firstName) return 'Le prénom est requis';
    if (firstName.length < 2) return 'Le prénom doit contenir au moins 2 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(firstName)) return 'Le prénom contient des caractères invalides';
    return null;
  },

  // Validation des moyennes
  average: (value) => {
    if (value === undefined || value === null) return 'La moyenne est requise';
    const num = parseFloat(value);
    if (isNaN(num)) return 'La moyenne doit être un nombre';
    if (num < 0 || num > 20) return 'La moyenne doit être comprise entre 0 et 20';
    if (num % 0.25 !== 0) return 'La moyenne doit être un multiple de 0.25';
    return null;
  },

  // Validation des notes
  grade: (value) => {
    if (value === undefined || value === null) return 'La note est requise';
    const num = parseFloat(value);
    if (isNaN(num)) return 'La note doit être un nombre';
    if (num < 0 || num > 20) return 'La note doit être comprise entre 0 et 20';
    return null;
  },

  // Validation des téléphones
  phone: (phone) => {
    if (!phone) return null; // Optionnel
    const cleaned = phone.replace(/[\s\-()]/g, '');
    if (!/^[0-9]{9,10}$/.test(cleaned)) return 'Numéro de téléphone invalide (ex: 771234567)';
    return null;
  },

  // Validation des dates
  date: (date) => {
    if (!date) return 'La date est requise';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    if (d > new Date()) return 'La date ne peut pas être dans le futur';
    return null;
  },

  // Validation des niveaux
  level: (level) => {
    const levels = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'];
    if (!level) return 'Le niveau est requis';
    if (!levels.includes(level)) return 'Niveau invalide. Choisir parmi: ' + levels.join(', ');
    return null;
  },

  // Validation des statuts
  status: (status) => {
    const statuses = ['admis', 'redouble', 'tangent'];
    if (!status) return 'Le statut est requis';
    if (!statuses.includes(status)) return 'Statut invalide. Choisir parmi: ' + statuses.join(', ');
    return null;
  },

  // Validation des nombres
  number: (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Doit être un nombre';
    if (min !== undefined && num < min) return `Doit être supérieur ou égal à ${min}`;
    if (max !== undefined && num > max) return `Doit être inférieur ou égal à ${max}`;
    return null;
  },

  // Validation des URLs
  url: (url) => {
    if (!url) return null;
    try {
      new URL(url);
      return null;
    } catch {
      return 'URL invalide';
    }
  },

  // Validation des champs requis
  required: (value, fieldName = 'Ce champ') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} est requis`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${fieldName} est requis`;
    }
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
      return `${fieldName} est requis`;
    }
    return null;
  },

  // Validation des formulaires complets
  validateForm: (data, rules) => {
    const errors = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const rule = rules[field];
      const value = data[field];
      const error = typeof rule === 'function' ? rule(value) : rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    return { isValid, errors };
  },

  // Validation d'un formulaire avec des règles multiples
  validateField: (value, validations) => {
    for (const validation of validations) {
      const error = validation(value);
      if (error) return error;
    }
    return null;
  }
};

// Export des validateurs individuels pour une utilisation facile
export const validateEmail = validators.email;
export const validatePassword = validators.password;
export const validateName = validators.name;
export const validateFirstName = validators.firstName;
export const validateAverage = validators.average;
export const validateGrade = validators.grade;
export const validatePhone = validators.phone;
export const validateDate = validators.date;
export const validateLevel = validators.level;
export const validateStatus = validators.status;
export const validateNumber = validators.number;
export const validateUrl = validators.url;
export const validateRequired = validators.required;
export const validateForm = validators.validateForm;
export const validateField = validators.validateField;

export default validators;