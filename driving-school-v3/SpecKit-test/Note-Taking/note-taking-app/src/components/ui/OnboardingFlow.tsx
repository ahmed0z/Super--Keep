'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Hybrid Notes',
    description: 'A modern note-taking app combining Google Keep\'s simplicity with Notion\'s rich content.',
    icon: '📝',
  },
  {
    title: 'Quick Note Creation',
    description: 'Press Ctrl+N anywhere to create a new note instantly. Your notes are automatically saved.',
    icon: '⚡',
  },
  {
    title: 'Rich Content Blocks',
    description: 'Add checklists, tables, and rich text to your notes. Mix different content types freely.',
    icon: '🎨',
  },
  {
    title: 'Powerful Organization',
    description: 'Use colors, tags, and search to organize and find your notes. Pin important ones to the top.',
    icon: '🗂️',
  },
  {
    title: 'Works Offline',
    description: 'Your notes are saved locally and work offline. Install the app for the best experience.',
    icon: '📱',
  },
];

export function OnboardingFlow() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('onboarding_completed');
  });
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 animate-scaleIn">
        <div className="flex justify-between items-start mb-6">
          <div className="text-4xl">{step.icon}</div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {step.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {step.description}
        </p>

        {/* Progress indicators */}
        <div className="flex gap-2 mb-6">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="ghost"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Get Started
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
