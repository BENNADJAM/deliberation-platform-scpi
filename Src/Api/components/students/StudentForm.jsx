import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaGraduationCap,
  FaSave,
  FaTimes,
  FaUpload,
  FaUserPlus
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  validateEmail, 
  validateName, 
  validatePhone, 
  validateDate,
  validateRequired 
} from '../../utils/validators';
import { LEVELS, STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentForm = ({ 
  student = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  isEditing = false 
}) => {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    classId: '',
    level: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    status: 'active',
    average: 0,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Charger les classes disponibles
  useEffect(() => {
    fetchClasses();
  }, []);

  // Remplir le formulaire si modification
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        birthDate: student.birthDate ? student.birthDate.split('T')[0] : '',
        birthPlace: student.birthPlace || '',
        address: student.address || '',
        classId: student.classId || '',
        level: student.level || '',
        parentName: student.parentName || '',
        parentPhone: student.parentPhone || '',
        parentEmail: student.parentEmail || '',
        status: student.status || 'active',
        average: student.average || 0,
        notes: student.notes || '',
      });
      
      if (student.photo) {
        setPhotoPreview(student.photo);
      }
    }
  }, [student]);

  const fetchClasses = async () => {
    try {
      // Simulation - à remplacer par votre API
      // const response = await api.get('/classes');
      // setClasses(response.data);
      
      // Données de démonstration
      const mockClasses = [
        { id: '1', name: '6ème A', level: '6ème' },
        { id: '2', name: '5ème B', level: '5ème' },
        { id: '3', name: '4ème A', level: '4ème' },
        { id: '4', name: '3ème C', level: '3ème' },
        { id: '5', name: 'Seconde A', level: 'Seconde' },
        { id: '6', name: 'Première B', level: 'Première' },
        { id: '7', name: 'Terminale A', level: 'Terminale' },
      ];
      setClasses(mockClasses);
    } catch (error) {
      toast.error('Erreur lors du chargement des classes');
    } finally {
      setLoadingClasses(false);
    }
  };

  // Validation des champs
  const validateField = (name, value) => {
    const validators = {
      firstName: (val) => validateName(val) || validateRequired(val, 'Prénom'),
      lastName: (val) => validateName(val) || validateRequired(val, 'Nom'),
      email: (val) => {
        if (!val) return null;
        return validateEmail(val);
      },
      phone: (val) => {
        if (!val) return null;
        return validatePhone(val);
      },
      birthDate: (val) => validateDate(val) || validateRequired(val, 'Date de naissance'),
      parentName: (val) => {
        if (!val) return null;
        return validateName(val);
      },
      parentPhone: (val) => {
        if (!val) return null;
        return validatePhone(val);
      },
      parentEmail: (val) => {
        if (!val) return null;
        return validateEmail(val);
      },
      classId: (val) => validateRequired(val, 'Classe'),
    };

    const validator = validators[name];
    return validator ? validator(value) : null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Validation en temps réel
    if (touched[name]) {
      const error = validateField(name, val);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La photo ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type de fichier
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Format de fichier non supporté. Utilisez JPG ou PNG');
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider tous les champs
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (!isValid) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    // Préparer les données à envoyer
    const submitData = {
      ...formData,
      photo: photo || photoPreview,
      fullName: `${formData.firstName} ${formData.lastName}`,
    };

    // Appeler la fonction onSubmit
    if (onSubmit) {
      await onSubmit(submitData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-4xl mx-auto"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Modifier l\'élève' : 'Ajouter un élève'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FaTimes className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
              <FaUpload className="text-white text-xs" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Téléchargez une photo (JPG, PNG - max 5MB)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Format recommandé : carré 200x200px
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prénom *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.firstName && touched.firstName ? 'border-red-500' : ''
                }`}
                placeholder="Jean"
                disabled={loading}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.lastName && touched.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Dupont"
                disabled={loading}
              />
            </div>
            {errors.lastName && touched.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.email && touched.email ? 'border-red-500' : ''
                }`}
                placeholder="jean.dupont@email.com"
                disabled={loading}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.phone && touched.phone ? 'border-red-500' : ''
                }`}
                placeholder="77 123 45 67"
                disabled={loading}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de naissance *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.birthDate && touched.birthDate ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
            </div>
            {errors.birthDate && touched.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
            )}
          </div>

          {/* Lieu de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lieu de naissance
            </label>
            <input
              type="text"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              className="input-field"
              placeholder="Dakar"
              disabled={loading}
            />
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adresse
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
            rows="2"
            placeholder="Adresse complète..."
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Classe *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGraduationCap className="text-gray-400" />
              </div>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${
                  errors.classId && touched.classId ? 'border-red-500' : ''
                }`}
                disabled={loading || loadingClasses}
              >
                <option value="">Sélectionner une classe</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.level}
                  </option>
                ))}
              </select>
            </div>
            {errors.classId && touched.classId && (
              <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="graduated">Diplômé</option>
              <option value="transferred">Transféré</option>
            </select>
          </div>
        </div>

        {/* Section parents */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUserPlus className="text-primary-600" />
            Informations des parents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du parent/tuteur
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className={`input-field ${
                  errors.parentName && touched.parentName ? 'border-red-500' : ''
                }`}
                placeholder="Nom du parent"
                disabled={loading}
              />
              {errors.parentName && touched.parentName && (
                <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone du parent
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className={`input-field ${
                  errors.parentPhone && touched.parentPhone ? 'border-red-500' : ''
                }`}
                placeholder="77 123 45 67"
                disabled={loading}
              />
              {errors.parentPhone && touched.parentPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email du parent
              </label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                className={`input-field ${
                  errors.parentEmail && touched.parentEmail ? 'border-red-500' : ''
                }`}
                placeholder="parent@email.com"
                disabled={loading}
              />
              {errors.parentEmail && touched.parentEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes supplémentaires
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            rows="3"
            placeholder="Informations complémentaires sur l'élève..."
            disabled={loading}
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 px-6 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? 'Modification...' : 'Création...'}
              </>
            ) : (
              <>
                <FaSave /> {isEditing ? 'Modifier' : 'Créer'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default StudentForm;