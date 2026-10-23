import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export interface FilterSelectOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterDropdownConfig {
  id: string;
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export interface FilterPillOption {
  label: string;
  value: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface FilterPillsConfig {
  id: string;
  label?: string;
  value: string;
  options: FilterPillOption[];
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  /** Search query value */
  search?: string;
  /** Search query change handler */
  onSearchChange?: (value: string) => void;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Select dropdown filters */
  dropdowns?: FilterDropdownConfig[];
  /** Pill/chip quick toggle filter groups */
  pills?: FilterPillsConfig[];
  /** Total count of items before filtering */
  totalCount?: number;
  /** Count of items after filtering */
  filteredCount?: number;
  /** Name of the entity being filtered (e.g. 'students', 'records') */
  itemLabel?: string;
  /** Handler to reset all filters to their default values */
  onReset?: () => void;
  /** Whether any non-default filter is currently applied */
  isFiltered?: boolean;
  /** Right-aligned actions (e.g., Export, Add New, etc.) */
  actions?: React.ReactNode;
  /** Additional custom class names */
  className?: string;
}

/**
 * Standard reusable FilterBar component for unified, clean searching and filtering
 * across all modules (Student Directory, Certificates, Fees, HR, Academics, etc.).
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search records by name, ID, or keywords...',
  dropdowns = [],
  pills = [],
  totalCount,
  filteredCount,
  itemLabel = 'records',
  onReset,
  isFiltered = false,
  actions,
  className = '',
}) => {
  const hasActiveFilters = isFiltered || Boolean(search && search.trim().length > 0);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3 transition-all ${className}`}
    >
      {/* Top Row: Search Input + Select Dropdowns + Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        {onSearchChange && (
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white font-medium transition-all"
            />
            {search && search.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Dropdown Select Filters */}
        {dropdowns.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {dropdowns.map((drop) => (
              <div key={drop.id} className="relative flex items-center">
                {drop.icon && (
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    {drop.icon}
                  </span>
                )}
                <select
                  value={drop.value}
                  onChange={(e) => drop.onChange(e.target.value)}
                  className={`text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 py-2.5 pr-8 cursor-pointer transition-all ${
                    drop.icon ? 'pl-8' : 'pl-3'
                  }`}
                  aria-label={drop.label}
                >
                  {drop.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                      {typeof opt.count === 'number' ? ` (${opt.count})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Right-Side Actions (e.g., Export, Add New, etc.) */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            {actions}
          </div>
        )}
      </div>

      {/* Bottom Row: Quick Filter Pills + Result Counter + Reset Button */}
      {(pills.length > 0 || typeof filteredCount === 'number' || hasActiveFilters) && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Quick Filter Pill Groups */}
          <div className="flex items-center gap-4 flex-wrap">
            {pills.map((group) => (
              <div key={group.id} className="flex items-center gap-1.5 flex-wrap">
                {group.label && (
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">
                    {group.label}:
                  </span>
                )}
                <div className="inline-flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-xl border border-slate-200/60">
                  {group.options.map((opt) => {
                    const isSelected = group.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => group.onChange(opt.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                        {typeof opt.count === 'number' && (
                          <span
                            className={`text-[10px] px-1 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-orange-700/80 text-orange-100'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {opt.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Counts & Clear Filters */}
          <div className="flex items-center gap-2.5 ml-auto">
            {typeof filteredCount === 'number' && (
              <span className="text-slate-500 font-medium text-[11px]">
                Showing <strong className="text-slate-900 font-bold">{filteredCount}</strong>
                {typeof totalCount === 'number' && totalCount !== filteredCount && (
                  <>
                    {' '}
                    of <span className="text-slate-700 font-semibold">{totalCount}</span>
                  </>
                )}{' '}
                {itemLabel}
              </span>
            )}

            {hasActiveFilters && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
