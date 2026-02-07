'use client';

import { useState, ReactNode } from 'react';
import clsx from 'clsx';
import {
  DataTable as PrimeDataTable,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column, ColumnProps, ColumnBodyOptions } from 'primereact/column';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { Pagination } from './pagination';
import { Spinner } from '../misc/Spinner';

export interface DataTableColumn<T = unknown> extends Omit<
  ColumnProps,
  'body'
> {
  field: string;
  header?: string;
  body?: (rowData: T, options: ColumnBodyOptions) => ReactNode;
  sortable?: boolean;
  filter?: boolean;
  frozen?: boolean;
  frozenPosition?: 'left' | 'right';
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  'data-testid'?: string;
  /** Alias for data-testid for convenience */
  dataTestId?: string;
}

export interface DataTablePaginationConfig {
  rows?: number;
  first?: number;
  totalRecords?: number;
  rowsPerPageOptions?: number[];
  showPageInfo?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  template?: string;
}

export interface DataTableProps<T = unknown> {
  columns: DataTableColumn<T>[];
  data: T[];

  // Selection
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
  selection?: T | T[];
  onSelectionChange?: (e: { value: T | T[] }) => void;

  // Row Expansion
  expandedRows?: Record<string, boolean> | T[];
  onRowToggle?: (e: { data: Record<string, boolean> | T[] }) => void;
  rowExpansionTemplate?: (rowData: T) => ReactNode;

  // Pagination
  pagination?: boolean | DataTablePaginationConfig;
  onPageChange?: (event: PaginatorPageChangeEvent) => void;
  paginationTestId?: string;

  // Sorting
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null | undefined;
  onSort?: (event: {
    sortField: string;
    sortOrder: 1 | -1 | 0 | null | undefined;
  }) => void;

  // Styling
  className?: string;
  containerClassName?: string;
  stripedRows?: boolean;

  // Other
  loading?: boolean;
  emptyMessage?: string | ReactNode;
  globalFilter?: string;
  globalFilterFields?: string[];
  dataKey?: string;

  // Testing
  'data-testid'?: string;
}

export function DataTable<T = unknown>({
  columns = [],
  data,
  selectionMode,
  selection,
  onSelectionChange,
  expandedRows,
  onRowToggle,
  rowExpansionTemplate,
  pagination = true,
  onPageChange,
  paginationTestId,
  sortField,
  sortOrder,
  onSort,
  className = '',
  containerClassName = '',
  stripedRows = true,
  loading = false,
  emptyMessage = 'No data found',
  globalFilter,
  globalFilterFields,
  dataKey = 'id',
  'data-testid': dataTestId,
}: DataTableProps<T>) {
  // Default pagination config
  const defaultPaginationConfig: DataTablePaginationConfig = {
    rows: 10,
    first: 0,
    totalRecords: data?.length || 0,
    rowsPerPageOptions: [5, 10, 25, 50],
    showPageInfo: true,
    showPrevNext: true,
    showPageNumbers: true,
  };

  const paginationConfig =
    typeof pagination === 'object'
      ? { ...defaultPaginationConfig, ...pagination }
      : pagination
        ? defaultPaginationConfig
        : null;

  // Use pagination state from config if provided (controlled), otherwise use local state
  // Controlled mode requires BOTH first being explicitly provided AND an onPageChange handler
  // This allows client-side pagination (rows provided, but no onPageChange) to work with local state
  const isControlled =
    typeof pagination === 'object' &&
    pagination.first !== undefined &&
    onPageChange !== undefined;

  const [localPaginationState, setLocalPaginationState] = useState(() => ({
    first: paginationConfig?.first ?? 0,
    rows: paginationConfig?.rows ?? 10,
  }));

  const paginationState = isControlled
    ? {
        first: paginationConfig?.first || 0,
        rows: paginationConfig?.rows || 10,
      }
    : localPaginationState;

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    // Always update local state for uncontrolled/client-side pagination
    if (!isControlled) {
      setLocalPaginationState({
        first: event.first,
        rows: event.rows,
      });
    }

    // Call external handler if provided (for controlled/server-side pagination)
    if (onPageChange) {
      onPageChange(event);
    }
  };

  // Calculate pagination info
  const totalRecords = paginationConfig?.totalRecords || data?.length || 0;

  // Only slice data for client-side pagination (uncontrolled mode)
  // Server-side pagination (controlled) already receives pre-sliced data from the backend
  // PrimeReact only slices data when paginator={true}, so we must do it manually for client-side
  const displayData =
    paginationConfig && !isControlled
      ? data.slice(
          paginationState.first,
          paginationState.first + paginationState.rows
        )
      : data;

  // Custom loading overlay with Spinner
  const loadingOverlay = loading ? (
    <div
      className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10"
      data-testid={dataTestId ? `${dataTestId}-loading` : 'datatable-loading'}
    >
      <Spinner style={{ width: '30px', height: '30px' }} />
    </div>
  ) : null;

  // Render custom paginator
  const renderCustomPaginator = () => {
    if (!paginationConfig) return null;

    const paginatorElement = (
      <Pagination
        first={paginationState.first}
        rows={paginationState.rows}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        rowsPerPageOptions={paginationConfig.rowsPerPageOptions}
        pageLinkSize={5}
        className="bg-transparent mx-auto"
      />
    );

    return paginationTestId ? (
      <div data-testid={paginationTestId}>{paginatorElement}</div>
    ) : (
      paginatorElement
    );
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-md relative',
        containerClassName
      )}
      data-testid={dataTestId}
    >
      {loadingOverlay}
      <PrimeDataTable
        value={displayData as DataTableValueArray}
        selection={selection as DataTableValueArray}
        onSelectionChange={onSelectionChange as never}
        selectionMode={selectionMode as never}
        cellSelection={false}
        dataKey={dataKey}
        stripedRows={stripedRows}
        loading={false}
        emptyMessage={emptyMessage}
        className={clsx('surface-ground', className)}
        globalFilter={globalFilter}
        globalFilterFields={globalFilterFields}
        paginator={false}
        first={paginationState.first}
        rows={paginationState.rows}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort as never}
        scrollable
        scrollHeight="flex"
        expandedRows={expandedRows as never}
        onRowToggle={onRowToggle as never}
        rowExpansionTemplate={rowExpansionTemplate as never}
      >
        {selectionMode === 'checkbox' && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
            frozen
          />
        )}

        {columns.map((col, index) => {
          const columnKey = col.field || `col-${index}`;
          // Support both data-testid and dataTestId (camelCase alias)
          const columnTestId =
            col['data-testid'] ||
            col.dataTestId ||
            `datatable-header-${col.field}`;

          return (
            <Column
              key={columnKey}
              // field={col.field}
              header={col.header}
              body={col.body}
              sortable={col.sortable}
              filter={col.filter}
              frozen={col.frozen}
              alignFrozen={
                col.frozenPosition || (col.frozen ? 'left' : undefined)
              }
              style={col.style}
              headerStyle={col.headerStyle}
              bodyStyle={col.bodyStyle}
              className={col.frozen ? 'p-frozen-column' : ''}
              pt={{
                headerCell: {
                  'data-testid': columnTestId,
                },
              }}
              {...col}
            />
          );
        })}
      </PrimeDataTable>

      {paginationConfig && renderCustomPaginator()}
    </div>
  );
}

export default DataTable;
