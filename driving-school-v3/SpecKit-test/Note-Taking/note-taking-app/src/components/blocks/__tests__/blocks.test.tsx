/**
 * Block Components Tests
 * Tests for checklist and table block components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChecklistBlock } from '@/components/blocks/ChecklistBlock';
import { TableBlock } from '@/components/blocks/TableBlock';
import { ChecklistBlock as ChecklistBlockType, TableBlock as TableBlockType } from '@/types';

describe('ChecklistBlock', () => {
  const mockChecklistBlock: ChecklistBlockType = {
    id: 'block-1',
    type: 'checklist',
    items: [
      { id: 'item-1', text: 'Task 1', checked: false, order: 0 },
      { id: 'item-2', text: 'Task 2', checked: true, order: 1 }
    ],
    order: 0
  };

  it('should render checklist items', () => {
    const onUpdate = vi.fn();
    render(<ChecklistBlock block={mockChecklistBlock} onUpdate={onUpdate} />);

    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 2')).toBeInTheDocument();
  });

  it('should display progress indicator', () => {
    const onUpdate = vi.fn();
    render(<ChecklistBlock block={mockChecklistBlock} onUpdate={onUpdate} />);

    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should call onUpdate when item is checked', () => {
    const onUpdate = vi.fn();
    render(<ChecklistBlock block={mockChecklistBlock} onUpdate={onUpdate} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onUpdate).toHaveBeenCalledWith({
      items: expect.arrayContaining([
        expect.objectContaining({ id: 'item-1', checked: true })
      ])
    });
  });

  it('should add new item when clicking add button', () => {
    const onUpdate = vi.fn();
    render(<ChecklistBlock block={mockChecklistBlock} onUpdate={onUpdate} />);

    const addButton = screen.getByText('Add item');
    fireEvent.click(addButton);

    expect(onUpdate).toHaveBeenCalledWith({
      items: expect.arrayContaining([
        ...mockChecklistBlock.items,
        expect.objectContaining({ text: '', checked: false })
      ])
    });
  });

  it('should show empty state in read-only mode', () => {
    const onUpdate = vi.fn();
    const emptyBlock: ChecklistBlockType = {
      ...mockChecklistBlock,
      items: []
    };

    render(<ChecklistBlock block={emptyBlock} onUpdate={onUpdate} readOnly={true} />);
    expect(screen.getByText('No checklist items')).toBeInTheDocument();
  });
});

describe('TableBlock', () => {
  const mockTableBlock: TableBlockType = {
    id: 'block-1',
    type: 'table',
    rows: 2,
    cols: 2,
    data: [
      [{ value: 'A1' }, { value: 'B1' }],
      [{ value: 'A2' }, { value: 'B2' }]
    ],
    order: 0
  };

  it('should render table with cells', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={mockTableBlock} onUpdate={onUpdate} />);

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
  });

  it('should display table dimensions', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={mockTableBlock} onUpdate={onUpdate} />);

    expect(screen.getByText('2 × 2')).toBeInTheDocument();
  });

  it('should add row when clicking add row button', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={mockTableBlock} onUpdate={onUpdate} />);

    const addRowButton = screen.getByTitle('Add row');
    fireEvent.click(addRowButton);

    expect(onUpdate).toHaveBeenCalledWith({
      rows: 3,
      data: expect.arrayContaining([
        ...mockTableBlock.data,
        expect.any(Array)
      ])
    });
  });

  it('should add column when clicking add column button', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={mockTableBlock} onUpdate={onUpdate} />);

    const addColButton = screen.getByTitle('Add column');
    fireEvent.click(addColButton);

    expect(onUpdate).toHaveBeenCalledWith({
      cols: 3,
      data: expect.arrayContaining([
        expect.arrayContaining([
          { value: 'A1' },
          { value: 'B1' },
          { value: '' }
        ])
      ])
    });
  });

  it('should disable remove buttons when minimum size reached', () => {
    const onUpdate = vi.fn();
    const minBlock: TableBlockType = {
      ...mockTableBlock,
      rows: 1,
      cols: 1,
      data: [[{ value: 'A1' }]]
    };

    render(<TableBlock block={minBlock} onUpdate={onUpdate} />);

    const removeRowButton = screen.getByTitle('Remove row');
    const removeColButton = screen.getByTitle('Remove column');

    expect(removeRowButton).toBeDisabled();
    expect(removeColButton).toBeDisabled();
  });

  it('should not show controls in read-only mode', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={mockTableBlock} onUpdate={onUpdate} readOnly={true} />);

    expect(screen.queryByTitle('Add row')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Add column')).not.toBeInTheDocument();
  });
});
