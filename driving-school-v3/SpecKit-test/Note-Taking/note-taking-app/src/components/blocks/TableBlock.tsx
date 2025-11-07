'use client';

import { TableBlock as TableBlockType, TableCell as TableCellType } from '@/types';
import { TableCell } from './TableCell';
import { Button } from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';

interface TableBlockProps {
  block: TableBlockType;
  onUpdate: (updates: Partial<TableBlockType>) => void;
  readOnly?: boolean;
}

export function TableBlock({ block, onUpdate, readOnly = false }: TableBlockProps) {
  const handleCellUpdate = (rowIndex: number, colIndex: number, value: string) => {
    const newData = block.data.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? { value } : cell))
        : row
    );
    onUpdate({ data: newData });
  };

  const handleAddRow = () => {
    const newRow: TableCellType[] = Array(block.cols).fill(null).map(() => ({ value: '' }));
    onUpdate({
      rows: block.rows + 1,
      data: [...block.data, newRow]
    });
  };

  const handleRemoveRow = () => {
    if (block.rows <= 1) return;
    onUpdate({
      rows: block.rows - 1,
      data: block.data.slice(0, -1)
    });
  };

  const handleAddColumn = () => {
    const newData = block.data.map(row => [...row, { value: '' }]);
    onUpdate({
      cols: block.cols + 1,
      data: newData
    });
  };

  const handleRemoveColumn = () => {
    if (block.cols <= 1) return;
    const newData = block.data.map(row => row.slice(0, -1));
    onUpdate({
      cols: block.cols - 1,
      data: newData
    });
  };

  return (
    <div className="space-y-2">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {block.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    value={cell.value}
                    onUpdate={(value) => handleCellUpdate(rowIndex, colIndex, value)}
                    readOnly={readOnly}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      {!readOnly && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddRow}
              title="Add row"
            >
              <Plus className="w-4 h-4 mr-1" />
              Row
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveRow}
              disabled={block.rows <= 1}
              title="Remove row"
            >
              <Minus className="w-4 h-4 mr-1" />
              Row
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddColumn}
              title="Add column"
            >
              <Plus className="w-4 h-4 mr-1" />
              Column
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveColumn}
              disabled={block.cols <= 1}
              title="Remove column"
            >
              <Minus className="w-4 h-4 mr-1" />
              Column
            </Button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {block.rows} × {block.cols}
          </div>
        </div>
      )}
    </div>
  );
}
