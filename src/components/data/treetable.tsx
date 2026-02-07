'use client';

import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import {
  TreeTable as PrimeTreeTable,
  TreeTableProps as PrimeTreeTableProps,
  TreeTablePageEvent,
  TreeTableExpandedKeysType,
} from 'primereact/treetable';
import { Column, ColumnProps, ColumnBodyOptions } from 'primereact/column';
import { TreeNode } from 'primereact/treenode';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { FormDropdown } from '../form';

export interface TreeTableColumn<T = unknown> extends Omit<
  ColumnProps,
  'body'
> {
  field: string;
  header?: string;
  body?: (node: { data: T }, options: ColumnBodyOptions) => ReactNode;
  expander?: boolean;
  frozen?: boolean;
  frozenPosition?: 'left' | 'right';
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headerClassName?: string;
  'data-testid'?: string;
}

export interface TreeTablePaginationConfig {
  first?: number;
  rows?: number;
  rowsPerPageOptions?: number[];
  totalRecords?: number;
}

export interface PaginatorDropdownOptions {
  value: number;
  onChange: (e: { value: number }) => void;
  options: { label: string; value: number }[];
}

export interface PaginatorButtonOptions {
  onClick: () => void;
  disabled: boolean;
}

export interface PaginatorReportOptions {
  first: number;
  last: number;
  totalRecords: number;
  currentPageReport?: string;
}

export interface TreeTableProps<T = unknown> {
  columns: TreeTableColumn<T>[];
  data: TreeNode[];

  // Pagination
  pagination?: boolean | TreeTablePaginationConfig;
  onPageChange?: (event: PaginatorPageChangeEvent) => void;

  // Expand/Collapse
  expandedKeys?: TreeTableExpandedKeysType;
  onToggle?: (keys: TreeTableExpandedKeysType) => void;

  // Styling
  className?: string;
  containerClassName?: string;
  stripedRows?: boolean;
  showGridlines?: boolean;

  // Other
  loading?: boolean;
  emptyMessage?: string | ReactNode;
  tableStyle?: React.CSSProperties;
}

export function TreeTable<T = unknown>({
  columns = [],
  data,
  pagination = false,
  onPageChange: externalOnPageChange,
  expandedKeys,
  onToggle,
  className = '',
  containerClassName = '',
  stripedRows = false,
  showGridlines = true,
  loading = false,
  emptyMessage = 'No data available',
  tableStyle,
}: TreeTableProps<T>) {
  // Default pagination config
  const defaultPaginationConfig =
    typeof pagination === 'object'
      ? pagination
      : pagination
        ? { rows: 10, first: 0, rowsPerPageOptions: [5, 10, 25, 50] }
        : null;

  // Internal state for uncontrolled mode (when pagination config doesn't have first/rows)
  const [paginationState, setPaginationState] = useState({
    first: defaultPaginationConfig?.first || 0,
    rows: defaultPaginationConfig?.rows || 10,
  });

  // Determine if we're in controlled mode (external props provided)
  const isControlledMode =
    defaultPaginationConfig &&
    typeof defaultPaginationConfig.first === 'number' &&
    typeof defaultPaginationConfig.rows === 'number';

  // Handle pagination
  const handlePageChange = (event: TreeTablePageEvent) => {
    // Only update internal state if in uncontrolled mode
    if (!isControlledMode) {
      setPaginationState({
        first: event.first,
        rows: event.rows,
      });
    }

    if (externalOnPageChange) {
      // Convert TreeTablePageEvent to PaginatorPageChangeEvent for compatibility
      const paginatorEvent: PaginatorPageChangeEvent = {
        first: event.first,
        rows: event.rows,
        page: event.page,
        pageCount: Math.ceil(totalRecords / event.rows),
      };
      externalOnPageChange(paginatorEvent);
    }
  };

  // Determine total records
  const totalRecords = defaultPaginationConfig?.totalRecords ?? data.length;

  // Use controlled values if provided, otherwise use internal state
  const effectiveFirst = isControlledMode
    ? defaultPaginationConfig.first
    : paginationState.first;
  const effectiveRows = isControlledMode
    ? defaultPaginationConfig.rows
    : paginationState.rows;

  // Merge pagination config with total records
  const finalPaginationConfig = defaultPaginationConfig
    ? {
        ...defaultPaginationConfig,
        totalRecords,
        first: effectiveFirst,
        rows: effectiveRows,
      }
    : null;

  // Custom paginator template
  const paginatorTemplate = finalPaginationConfig
    ? {
        layout:
          'RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink',
        RowsPerPageDropdown: (options: PaginatorDropdownOptions) => {
          const dropdownOptions = (
            finalPaginationConfig.rowsPerPageOptions || [5, 10, 25, 50]
          ).map((opt) => ({
            label: String(opt),
            value: opt,
          }));
          return (
            <span className="flex align-items-center gap-2">
              <span className="text-sm text-600">Show data</span>
              <FormDropdown
                value={options.value}
                options={dropdownOptions}
                optionLabel="label"
                optionValue="value"
                onChange={options.onChange}
                aria-label="Rows per page"
                style={{ width: '60px', height: '30px' }}
              />
              <span className="text-sm text-600 ml-3">per page</span>
            </span>
          );
        },
        CurrentPageReport: (options: PaginatorReportOptions) => (
          <span className="text-sm text-600 ml-3">
            Showing {options.first}-{options.last} of {options.totalRecords}{' '}
            entries
          </span>
        ),
        PrevPageLink: (options: PaginatorButtonOptions) => (
          <button
            type="button"
            className={clsx('p-paginator-prev p-paginator-element p-link', {
              'p-disabled': options.disabled,
            })}
            onClick={options.onClick}
            disabled={options.disabled}
          >
            Previous
          </button>
        ),
        NextPageLink: (options: PaginatorButtonOptions) => (
          <button
            type="button"
            className={clsx('p-paginator-next p-paginator-element p-link', {
              'p-disabled': options.disabled,
            })}
            onClick={options.onClick}
            disabled={options.disabled}
          >
            Next
          </button>
        ),
      }
    : undefined;

  return (
    <>
      <div
        className={clsx('surface-card treetable-wrapper', containerClassName)}
      >
        <PrimeTreeTable
          value={data}
          tableStyle={tableStyle || { minWidth: '50rem' }}
          emptyMessage={emptyMessage}
          stripedRows={stripedRows}
          showGridlines={showGridlines}
          loading={loading}
          className={clsx(className)}
          lazy={!!finalPaginationConfig}
          paginator={!!finalPaginationConfig}
          rows={finalPaginationConfig?.rows}
          first={finalPaginationConfig?.first}
          totalRecords={finalPaginationConfig?.totalRecords}
          rowsPerPageOptions={finalPaginationConfig?.rowsPerPageOptions}
          onPage={handlePageChange}
          paginatorTemplate={
            paginatorTemplate as PrimeTreeTableProps['paginatorTemplate']
          }
          paginatorClassName="custom-paginator"
          expandedKeys={expandedKeys}
          onToggle={(e) => onToggle?.(e.value)}
        >
          {columns.map((col, index) => {
            const columnKey = col.field || `col-${index}`;

            return (
              <Column
                key={columnKey}
                header={col.header}
                body={col.body as ColumnProps['body']}
                expander={col.expander}
                frozen={col.frozen}
                alignFrozen={
                  col.frozenPosition || (col.frozen ? 'left' : undefined)
                }
                style={col.style}
                headerStyle={col.headerStyle}
                bodyStyle={col.bodyStyle}
                headerClassName={col.headerClassName}
                pt={{
                  headerCell: {
                    'data-testid': col['data-testid']
                      ? col['data-testid']
                      : `datatable-header-${col.field}`,
                  },
                }}
                {...col}
              />
            );
          })}
        </PrimeTreeTable>
      </div>
    </>
  );
}

export default TreeTable;
