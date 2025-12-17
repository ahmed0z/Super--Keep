/**
 * Collaborator component for sharing notes.
 * Provides UI flow for adding collaborators (mock implementation).
 */
import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Collaborator } from '../../types';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { clsx } from '../../utils/clsx';

interface CollaboratorManagerProps {
  collaborators: Collaborator[];
  onAddCollaborator: (collaborator: Omit<Collaborator, 'id' | 'addedAt'>) => void;
  onRemoveCollaborator: (collaboratorId: string) => void;
  className?: string;
}

export const CollaboratorManager: React.FC<CollaboratorManagerProps> = ({
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  className,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [error, setError] = useState('');

  const validateEmail = (emailStr: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  const handleAddCollaborator = () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (collaborators.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      setError('This person is already a collaborator');
      return;
    }

    onAddCollaborator({ email, role });
    setEmail('');
    setError('');
  };

  return (
    <Popover className={clsx('relative', className)}>
      <PopoverButton
        className={clsx(
          'inline-flex items-center justify-center rounded-full p-2.5',
          'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container-high)]',
          'focus:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-primary)]',
          'transition-all duration-200 active:scale-95',
          collaborators.length > 0 && 'text-[var(--color-primary)]'
        )}
        title="Share with others"
      >
        <UserPlusIcon className="h-5 w-5" />
      </PopoverButton>

      <PopoverPanel
        className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl bg-[var(--color-surface-container)] py-4 shadow-xl border border-[var(--color-outline-variant)] focus:outline-none animate-[scaleIn_0.2s_ease-out]"
      >
        <div className="px-5 pb-3">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Share with others
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            Add people by email to collaborate on this note
          </p>
        </div>

        {/* Add collaborator form */}
        <div className="border-t border-[var(--color-outline-variant)] px-5 py-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Add email"
                error={error}
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCollaborator();
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                  className="rounded-xl border-2 border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="editor">Can edit</option>
                  <option value="viewer">Can view</option>
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddCollaborator()}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Collaborators list */}
            {collaborators.length > 0 && (
              <div className="border-t border-[var(--color-outline-variant)] px-5 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  People with access
                </p>
                <div className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-container-high)] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {collaborator.email}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {collaborator.role === 'editor' ? 'Can edit' : 'Can view'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCollaborator(collaborator.id)}
                        className="rounded-full p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-container)] active:scale-95 transition-all"
                        aria-label={`Remove ${collaborator.email}`}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note about mock implementation */}
            <div className="border-t border-[var(--color-outline-variant)] mt-4 px-5 pt-4">
              <p className="text-xs text-[var(--color-text-tertiary)] italic">
                Note: Sharing is a UI mock. Backend implementation needed.
              </p>
            </div>
          </PopoverPanel>
    </Popover>
  );
};
