/**
 * Tailwind Animations Configuration
 * Custom animations for the note-taking app
 */

module.exports = {
  animation: {
    'fade-in': 'fadeIn 0.2s ease-in-out',
    'fade-out': 'fadeOut 0.2s ease-in-out',
    'slide-in': 'slideIn 0.3s ease-out',
    'slide-out': 'slideOut 0.3s ease-out',
    'scale-in': 'scaleIn 0.2s ease-out',
    'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideIn: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideOut: {
      '0%': { transform: 'translateY(0)', opacity: '1' },
      '100%': { transform: 'translateY(-10px)', opacity: '0' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    bounceSubtle: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-4px)' },
    },
  },
};
