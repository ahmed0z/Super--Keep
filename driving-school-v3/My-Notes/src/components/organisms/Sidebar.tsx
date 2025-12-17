/**
 * Sidebar component with navigation and label management.
 * Supports expanded (full) and collapsed (icon rail) modes.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LightBulbIcon,
  BellIcon,
  TagIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useLabelsStore } from '../../store/labelsStore';
import { IconButton } from '../atoms/IconButton';
import { Tooltip } from '../atoms/Tooltip';
import { clsx } from '../../utils/clsx';

interface SidebarProps {
  isExpanded: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const labels = useLabelsStore((state) => state.labels);
  const createLabel = useLabelsStore((state) => state.createLabel);
  const updateLabel = useLabelsStore((state) => state.updateLabel);
  const deleteLabel = useLabelsStore((state) => state.deleteLabel);

  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState('');

  const navItems = [
    { to: '/', icon: LightBulbIcon, label: 'Notes' },
    { to: '/reminders', icon: BellIcon, label: 'Reminders' },
  ];

  const bottomNavItems = [
    { to: '/archive', icon: ArchiveBoxIcon, label: 'Archive' },
    { to: '/trash', icon: TrashIcon, label: 'Trash' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    try {
      await createLabel(newLabelName);
      setNewLabelName('');
    } catch {
      // Error handled by store
    }
  };

  const handleUpdateLabel = async (id: string) => {
    if (!editingLabelName.trim()) return;
    try {
      await updateLabel(id, editingLabelName);
      setEditingLabelId(null);
      setEditingLabelName('');
    } catch {
      // Error handled by store
    }
  };

  const handleDeleteLabel = async (id: string) => {
    await deleteLabel(id);
  };

  const startEditingLabel = (id: string, name: string) => {
    setEditingLabelId(id);
    setEditingLabelName(name);
  };

  // Collapsed nav item with tooltip
  const CollapsedNavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
    <Tooltip content={label} position="right">
      <NavLink
        to={to}
        onClick={() => {
          if (window.innerWidth < 1024) {
            onToggle?.();
          }
        }}
        className={({ isActive }) =>
          clsx(
            'flex items-center justify-center w-12 h-12 rounded-2xl',
            'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
            isActive
              ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-primary-container)]'
              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)]'
          )
        }
      >
        <Icon className="h-6 w-6" />
      </NavLink>
    </Tooltip>
  );

  // Expanded nav item
  const ExpandedNavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
    <NavLink
      to={to}
      onClick={() => {
        if (window.innerWidth < 1024) {
          onToggle?.();
        }
      }}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium',
          'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
          isActive
            ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-primary-container)] font-semibold'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)]'
        )
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 transform pt-16',
        'bg-[var(--color-surface)] border-r border-[var(--color-outline-variant)]',
        'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
        // Width based on expanded state
        isExpanded ? 'w-72' : 'w-20',
        // On mobile, slide off screen when collapsed
        isExpanded ? 'translate-x-0' : 'max-lg:-translate-x-full lg:translate-x-0'
      )}
    >
      <nav className="h-full overflow-y-auto overflow-x-hidden py-3 scrollbar-thin">
        {/* Main navigation */}
        <ul className={clsx('space-y-1', isExpanded ? 'px-3' : 'px-2 flex flex-col items-center')}>
          {navItems.map((item) => (
            <li key={item.to} className={isExpanded ? '' : 'w-full flex justify-center'}>
              {isExpanded ? (
                <ExpandedNavItem {...item} />
              ) : (
                <CollapsedNavItem {...item} />
              )}
            </li>
          ))}
        </ul>

        {/* Labels section - only show when expanded */}
        {isExpanded && (
          <div className="mt-3 border-t border-[var(--color-outline-variant)] pt-3 px-3">
            <div className="flex items-center justify-between px-4 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Labels
              </h3>
              <IconButton
                icon={<PencilIcon className="h-4 w-4" />}
                label={isEditingLabels ? 'Done editing' : 'Edit labels'}
                size="sm"
                onClick={() => setIsEditingLabels(!isEditingLabels)}
              />
            </div>

            <ul className="space-y-1">
              {labels.map((label) => (
                <li key={label.id}>
                  {editingLabelId === label.id ? (
                    <div className="flex items-center gap-2 px-4 py-2">
                      <input
                        type="text"
                        value={editingLabelName}
                        onChange={(e) => setEditingLabelName(e.target.value)}
                        onBlur={() => handleUpdateLabel(label.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateLabel(label.id);
                          if (e.key === 'Escape') {
                            setEditingLabelId(null);
                            setEditingLabelName('');
                          }
                        }}
                        className="flex-1 rounded-xl border-2 border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <NavLink
                      to={`/label/${label.id}`}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle?.();
                        }
                      }}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium group',
                          'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
                          isActive
                            ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-primary-container)] font-semibold'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)]'
                        )
                      }
                    >
                      <TagIcon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 truncate">{label.name}</span>
                      {isEditingLabels && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <IconButton
                            icon={<PencilIcon className="h-4 w-4" />}
                            label="Edit label"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startEditingLabel(label.id, label.name);
                            }}
                          />
                          <IconButton
                            icon={<TrashIcon className="h-4 w-4" />}
                            label="Delete label"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteLabel(label.id);
                            }}
                          />
                        </div>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}

              {/* Create new label */}
              {isEditingLabels && (
                <li className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateLabel();
                      }}
                      placeholder="Create new label"
                      className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
                    />
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Collapsed labels icon */}
        {!isExpanded && labels.length > 0 && (
          <div className="mt-3 border-t border-[var(--color-outline-variant)] pt-3 px-2 flex flex-col items-center">
            <Tooltip content="Labels" position="right">
              <NavLink
                to={`/label/${labels[0]?.id}`}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-center w-12 h-12 rounded-2xl',
                    'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
                    isActive
                      ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-primary-container)]'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)]'
                  )
                }
              >
                <TagIcon className="h-6 w-6" />
              </NavLink>
            </Tooltip>
          </div>
        )}

        {/* Archive, Trash, Settings */}
        <div className={clsx(
          'mt-3 border-t border-[var(--color-outline-variant)] pt-3',
          isExpanded ? 'px-3' : 'px-2 flex flex-col items-center'
        )}>
          <ul className={clsx('space-y-1', !isExpanded && 'flex flex-col items-center')}>
            {bottomNavItems.map((item) => (
              <li key={item.to} className={isExpanded ? '' : 'w-full flex justify-center'}>
                {isExpanded ? (
                  <ExpandedNavItem {...item} />
                ) : (
                  <CollapsedNavItem {...item} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
