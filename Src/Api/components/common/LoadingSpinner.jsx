import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text = 'Chargement...',
  showText = true,
  fullScreen = false,
  overlay = false,
  variant = 'default', // 'default', 'dots', 'pulse', 'skeleton'
  className = '',
}) => {
  const { colors, isDarkMode } = useTheme();

  // Tailles disponibles
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
    },
    md: {
      container: 'w-12 h-12',
      text: 'text-base',
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-lg',
    },
    xl: {
      container: 'w-24 h-24',
      text: 'text-xl',
    },
  };

  // Couleurs disponibles
  const colorsMap = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    success: 'border-green-500',
    danger: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colorsMap[color] || colorsMap.primary;

  // Variant: Default - Spinner circulaire
  const renderDefaultSpinner = () => (
    <div className={`relative ${sizeClass.container}`}>
      <div className={`absolute inset-0 rounded-full border-4 ${colorClass} border-t-transparent animate-spin`} />
      <div className={`absolute inset-2 rounded-full border-4 ${colorClass} border-b-transparent animate-spin`} 
           style={{ animationDuration: '1.5s' }} />
    </div>
  );

  // Variant: Dots - Points qui dansent
  const renderDotsSpinner = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`rounded-full ${colorClass.replace('border-', 'bg-')}`}
          style={{
            width: size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px',
            height: size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px',
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  // Variant: Pulse - Effet de pulsation
  const renderPulseSpinner = () => (
    <div className="relative">
      <motion.div
        className={`rounded-full ${colorClass.replace('border-', 'bg-')} opacity-20`}
        style={{
          width: size === 'sm' ? '40px' : size === 'lg' ? '80px' : '60px',
          height: size === 'sm' ? '40px' : size === 'lg' ? '80px' : '60px',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${colorClass.replace('border-', 'bg-')}`}
        style={{
          width: size === 'sm' ? '40px' : size === 'lg' ? '80px' : '60px',
          height: size === 'sm' ? '40px' : size === 'lg' ? '80px' : '60px',
        }}
        animate={{
          scale: [0.5, 1, 0.5],
          opacity: [0.8, 0.2, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </div>
  );

  // Variant: Skeleton - Placeholder de chargement
  const renderSkeletonSpinner = () => (
    <div className="space-y-3 w-full max-w-md">
      <motion.div
        className="h-4 rounded bg-gray-200 dark:bg-gray-700"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-5/6"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-4/6"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
      <div className="flex gap-2 mt-4">
        <motion.div
          className="h-24 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.1,
          }}
        />
        <div className="flex-1 space-y-2">
          <motion.div
            className="h-4 rounded bg-gray-200 dark:bg-gray-700"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.3,
            }}
          />
          <motion.div
            className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-4/5"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
        </div>
      </div>
    </div>
  );

  // Rendu du spinner selon la variante
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return renderDotsSpinner();
      case 'pulse':
        return renderPulseSpinner();
      case 'skeleton':
        return renderSkeletonSpinner();
      default:
        return renderDefaultSpinner();
    }
  };

  // Contenu du spinner
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {renderSpinner()}
      {showText && text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${sizeClass.text} text-gray-600 dark:text-gray-300 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  // Rendu avec overlay ou plein écran
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
        {content}
      </div>
    );
  }

  return content;
};

// Composant LoadingSpinner avec des variantes prédéfinies
export const Spinner = ({ size = 'md', color = 'primary', text = 'Chargement...', ...props }) => (
  <LoadingSpinner size={size} color={color} text={text} variant="default" {...props} />
);

export const DotSpinner = ({ size = 'md', color = 'primary', text = 'Chargement...', ...props }) => (
  <LoadingSpinner size={size} color={color} text={text} variant="dots" {...props} />
);

export const PulseSpinner = ({ size = 'md', color = 'primary', text = 'Chargement...', ...props }) => (
  <LoadingSpinner size={size} color={color} text={text} variant="pulse" {...props} />
);

export const SkeletonLoader = ({ color = 'gray', text = '', ...props }) => (
  <LoadingSpinner color={color} text={text} variant="skeleton" size="lg" {...props} />
);

// Composant de chargement pour les tableaux
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full">
      <div className="animate-pulse">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant de chargement pour les cartes
export const CardLoader = ({ count = 4 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      ))}
    </div>
  );
};

// Composant de chargement pour les graphiques
export const ChartLoader = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full h-64 animate-pulse">
      <div className="flex items-end justify-between h-full gap-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-t"
            style={{
              height: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;