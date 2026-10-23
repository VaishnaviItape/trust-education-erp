import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string = string> {
  key: K | null;
  direction: SortDirection;
}

export interface UseTableSortOptions<T, K extends string = string> {
  defaultKey?: K | null;
  defaultDirection?: SortDirection;
  customComparators?: Partial<Record<K, (a: T, b: T) => number>>;
}

/**
 * Robust string/number/date comparator for sorting generic arrays
 */
export function defaultComparator<T>(a: T, b: T, key: string, direction: SortDirection = 'asc'): number {
  const getNestedValue = (obj: any, path: string) => {
    if (!obj) return undefined;
    if (!path.includes('.')) return obj[path];
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  };

  const valA = getNestedValue(a, key);
  const valB = getNestedValue(b, key);

  // Handle nullish values (push to end)
  if (valA === undefined || valA === null) return direction === 'asc' ? 1 : -1;
  if (valB === undefined || valB === null) return direction === 'asc' ? -1 : 1;

  // Numeric comparison
  if (typeof valA === 'number' && typeof valB === 'number') {
    return direction === 'asc' ? valA - valB : valB - valA;
  }

  // Boolean comparison
  if (typeof valA === 'boolean' && typeof valB === 'boolean') {
    const numA = valA ? 1 : 0;
    const numB = valB ? 1 : 0;
    return direction === 'asc' ? numA - numB : numB - numA;
  }

  // Date strings check (e.g., YYYY-MM-DD or DD-MM-YYYY)
  const isDatePattern = (str: string) => /^\d{4}-\d{2}-\d{2}$|^\d{2}-\d{2}-\d{4}$/.test(str);
  if (typeof valA === 'string' && typeof valB === 'string') {
    if (isDatePattern(valA) && isDatePattern(valB)) {
      const parseDate = (d: string) => {
        if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
          const [day, month, year] = d.split('-').map(Number);
          return new Date(year, month - 1, day).getTime();
        }
        return new Date(d).getTime();
      };
      const timeA = parseDate(valA);
      const timeB = parseDate(valB);
      if (!isNaN(timeA) && !isNaN(timeB)) {
        return direction === 'asc' ? timeA - timeB : timeB - timeA;
      }
    }

    // String natural comparison (numeric aware, case-insensitive)
    const result = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
    return direction === 'asc' ? result : -result;
  }

  // Fallback to stringification
  const strA = String(valA);
  const strB = String(valB);
  const result = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
  return direction === 'asc' ? result : -result;
}

/**
 * Custom hook to manage client-side sorting of table data
 */
export function useTableSort<T, K extends string = string>(
  data: T[],
  options: UseTableSortOptions<T, K> = {}
) {
  const { defaultKey = null, defaultDirection = 'asc', customComparators } = options;
  const [sortKey, setSortKey] = useState<K | null>(defaultKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection);

  const handleSort = (key: K) => {
    if (sortKey === key) {
      // Toggle direction between asc and desc
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Switch to new sort key with ascending direction
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const setSort = (key: K | null, direction: SortDirection = 'asc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const resetSort = () => {
    setSortKey(defaultKey);
    setSortDirection(defaultDirection);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const list = [...data];
    const customComp = customComparators?.[sortKey];

    if (customComp) {
      list.sort((a, b) => {
        const res = customComp(a, b);
        return sortDirection === 'asc' ? res : -res;
      });
      return list;
    }

    list.sort((a, b) => defaultComparator(a, b, sortKey, sortDirection));
    return list;
  }, [data, sortKey, sortDirection, customComparators]);

  return {
    sortedData,
    sortKey,
    sortDirection,
    handleSort,
    setSort,
    resetSort,
  };
}

/**
 * Visual indicator icon for table header sort status
 */
export const SortIndicator: React.FC<{
  active: boolean;
  direction?: SortDirection;
  className?: string;
}> = ({ active, direction = 'asc', className = '' }) => {
  if (!active) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center text-slate-300 group-hover:text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity ${className}`}
      >
        <ArrowUpDown className="w-3 h-3" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center text-orange-600 bg-orange-100/70 p-0.5 rounded transition-transform ${className}`}
    >
      {direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
    </span>
  );
};

export interface SortableThProps<K extends string = string>
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  label: React.ReactNode;
  sortKey?: K;
  currentSortKey?: K | null;
  currentKey?: K | null;
  currentDirection?: SortDirection;
  direction?: SortDirection;
  onSort?: (key: K) => void;
  align?: 'left' | 'center' | 'right';
  isSortable?: boolean;
}

/**
 * Reusable table header cell (<th>) with clickable sorting and indicator
 */
export const SortableTh = <K extends string = string>({
  label,
  sortKey,
  currentSortKey,
  currentKey,
  currentDirection,
  direction,
  onSort,
  align = 'left',
  isSortable = true,
  className = '',
  children,
  ...rest
}: SortableThProps<K>) => {
  const activeSortKey = currentSortKey ?? currentKey;
  const activeDirection: SortDirection = currentDirection ?? direction ?? 'asc';
  const canSort = Boolean(isSortable && sortKey && onSort);
  const isActive = Boolean(canSort && activeSortKey === sortKey);

  const getAlignClasses = () => {
    switch (align) {
      case 'center':
        return 'justify-center text-center';
      case 'right':
        return 'justify-end text-right';
      case 'left':
      default:
        return 'justify-start text-left';
    }
  };

  const getHeaderClasses = () => {
    let base = `py-3 px-3 transition-colors select-none bg-slate-50 ${className} `;
    if (canSort) {
      base += 'cursor-pointer group hover:bg-slate-100/90 ';
      if (isActive) {
        base += 'bg-orange-50 text-orange-950 font-black ';
      }
    }
    return base.trim();
  };

  const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    if (canSort && sortKey && onSort) {
      onSort(sortKey);
    }
    rest.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
    if (canSort && sortKey && onSort && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSort(sortKey);
    }
    rest.onKeyDown?.(e);
  };

  return (
    <th
      {...rest}
      className={getHeaderClasses()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={canSort ? 'columnheader' : undefined}
      tabIndex={canSort ? 0 : undefined}
      aria-sort={
        canSort
          ? isActive
            ? activeDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
          : undefined
      }
      title={canSort ? `Sort by ${typeof label === 'string' ? label : 'this column'}` : undefined}
    >
      <div className={`flex items-center gap-1.5 ${getAlignClasses()}`}>
        <span className="truncate">{label}</span>
        {canSort && <SortIndicator active={isActive} direction={activeDirection} />}
        {children}
      </div>
    </th>
  );
};

export interface TableScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable scroll container that bounds tables to viewport height
 * and enables within-screen vertical and horizontal scrolling with hidden scroller bars.
 */
export const TableScrollContainer: React.FC<TableScrollContainerProps> = ({
  maxHeight,
  className = '',
  children,
  ...rest
}) => {
  return (
    <div
      className={`erp-table-scroll overflow-x-auto overflow-y-auto ${maxHeight || ''} min-h-[260px] relative ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
