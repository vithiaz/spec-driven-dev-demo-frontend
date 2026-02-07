'use client';

import { ReactNode, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableColumn,
  DataTablePaginationConfig,
} from '../data/datatable';
import {
  useSupabaseQuery,
  createSupabaseQuery,
} from '@/lib/supabase/query/client';
import type { SupabaseDatabase } from '@/lib/supabase/types';
import type { TypedSupabaseClient } from '@/lib/supabase/query/types';
import { PaginatorPageChangeEvent } from 'primereact/paginator';

type SupabaseTable = keyof SupabaseDatabase['public']['Tables'];

export interface DataListFilter {
  field: string;
  operator?:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'like'
    | 'ilike'
    | 'in';
  value: unknown;
}

export interface DataListSort {
  field: string;
  order?: 'asc' | 'desc';
}

export interface CustomQueryFn<T> {
  (
    client: TypedSupabaseClient,
    pagination?: { from: number; to: number }
  ): Promise<{ data: T[]; count: number }>;
}

export interface DataListProps<T = unknown> {
  // Table config
  table: SupabaseTable;
  columns: DataTableColumn<T>[];
  select?: string;

  // Query options
  customQuery?: CustomQueryFn<T>;
  filters?: DataListFilter[];
  search?: {
    value: string;
    fields: string[];
  };
  sort?: DataListSort;

  // External data
  value?: T[];
  totalRecords?: number;

  // Pagination
  pagination?: boolean | DataTablePaginationConfig;
  serverSidePagination?: boolean;
  onPageChange?: (event: PaginatorPageChangeEvent) => void;

  // Selection
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
  selection?: T | T[];
  onSelectionChange?: (e: { value: T | T[] }) => void;

  // Row Expansion
  expandedRows?: Record<string, boolean> | T[];
  onRowToggle?: (e: { data: Record<string, boolean> | T[] }) => void;
  rowExpansionTemplate?: (rowData: T) => ReactNode;

  // Styling
  className?: string;
  containerClassName?: string;
  stripedRows?: boolean;

  // Other
  loading?: boolean;
  emptyMessage?: string | ReactNode;
  errorMessage?: string | ReactNode;
  dataKey?: string;
  queryKey?: string[];
  enableRealtime?: boolean;
  realtimeTable?: SupabaseTable;

  // Testing
  paginationTestId?: string;
}

export function DataList<T = unknown>({
  table,
  columns,
  select = '*',
  customQuery,
  filters = [],
  search,
  sort,
  value: externalValue,
  totalRecords: externalTotalRecords,
  pagination = true,
  serverSidePagination = false,
  onPageChange: externalOnPageChange,
  selectionMode,
  selection,
  onSelectionChange,
  expandedRows,
  onRowToggle,
  rowExpansionTemplate,
  className,
  containerClassName,
  stripedRows = true,
  loading: externalLoading,
  emptyMessage = 'No data found',
  errorMessage,
  dataKey = 'id',
  queryKey,
  enableRealtime = true,
  realtimeTable,
  paginationTestId,
}: DataListProps<T>) {
  // Pagination state
  const defaultPaginationConfig =
    typeof pagination === 'object'
      ? pagination
      : pagination
        ? { rows: 10, first: 0, rowsPerPageOptions: [5, 10, 25, 50] }
        : null;

  const [paginationState, setPaginationState] = useState({
    first: defaultPaginationConfig?.first || 0,
    rows: defaultPaginationConfig?.rows || 10,
  });

  // Build query key with pagination params
  const finalQueryKey = useMemo(() => {
    const baseKey = queryKey || [
      table,
      select,
      JSON.stringify(filters),
      JSON.stringify(search),
      JSON.stringify(sort),
    ];

    // Always append pagination state for server-side pagination
    if (serverSidePagination) {
      return [...baseKey, JSON.stringify(paginationState)];
    }

    return baseKey;
  }, [
    table,
    select,
    filters,
    search,
    sort,
    queryKey,
    serverSidePagination,
    paginationState,
  ]);

  // Create query config
  const queryConfig = useMemo(() => {
    return createSupabaseQuery<{ data: T[]; count: number }>({
      key: finalQueryKey,
      select: async (client) => {
        // Calculate pagination range for server-side pagination
        const from = serverSidePagination ? paginationState.first : 0;
        const to = serverSidePagination
          ? paginationState.first + paginationState.rows - 1
          : undefined;

        // Use custom query if provided
        if (customQuery) {
          return customQuery(
            client,
            serverSidePagination ? { from, to: to! } : undefined
          );
        }

        // Build standard query with count for server-side pagination
        let query = client.from(table).select(select, {
          count: serverSidePagination ? 'exact' : undefined,
        });

        // Apply filters
        filters.forEach((filter) => {
          const { field, operator = 'eq', value } = filter;

          switch (operator) {
            case 'eq':
              query = query.eq(field, value as never);
              break;
            case 'neq':
              query = query.neq(field, value as never);
              break;
            case 'gt':
              query = query.gt(field, value as never);
              break;
            case 'gte':
              query = query.gte(field, value as never);
              break;
            case 'lt':
              query = query.lt(field, value as never);
              break;
            case 'lte':
              query = query.lte(field, value as never);
              break;
            case 'like':
              query = query.like(field, value as string);
              break;
            case 'ilike':
              query = query.ilike(field, value as string);
              break;
            case 'in':
              query = query.in(field, value as never[]);
              break;
          }
        });

        // Apply search
        if (search && search.value && search.fields.length > 0) {
          const searchConditions = search.fields
            .map((field) => `${field}.ilike.%${search.value}%`)
            .join(',');
          query = query.or(searchConditions);
        }

        // Apply sort
        if (sort) {
          query = query.order(sort.field, {
            ascending: sort.order === 'asc',
          });
        }

        // Apply server-side pagination
        if (serverSidePagination && to !== undefined) {
          query = query.range(from, to);
        }

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        return {
          data: (data as T[]) ?? [],
          count: count ?? 0,
        };
      },
      ...(enableRealtime && {
        realtime: {
          table: realtimeTable || table,
          event: '*',
          invalidateKeys: [finalQueryKey],
        },
      }),
    });
  }, [
    table,
    select,
    customQuery,
    filters,
    search,
    sort,
    finalQueryKey,
    enableRealtime,
    realtimeTable,
    serverSidePagination,
    paginationState,
  ]);

  // Fetch data using Supabase query (skip if external data provided)
  const {
    data: queryResult,
    isLoading,
    error,
  } = useSupabaseQuery(
    externalValue ? { ...queryConfig, enabled: false } : queryConfig
  );

  const data = externalValue ?? queryResult?.data ?? [];
  const totalRecords =
    externalTotalRecords ?? queryResult?.count ?? data.length;

  // Handle pagination
  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setPaginationState({
      first: event.first,
      rows: event.rows,
    });

    if (externalOnPageChange) {
      externalOnPageChange(event);
    }
  };

  // Determine loading state
  const isLoadingState =
    externalLoading !== undefined ? externalLoading : isLoading;

  // Show error message separately with custom layout, or use emptyMessage
  const finalEmptyMessage = error
    ? errorMessage || (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <i className="pi pi-exclamation-triangle text-4xl text-red-400" />
          <h4 className="m-0 text-xl font-semibold text-red-600">
            Error Loading Data
          </h4>
          <p className="m-0 text-sm text-red-500">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      )
    : emptyMessage;

  // Merge pagination config with total records
  const finalPaginationConfig = defaultPaginationConfig
    ? {
        ...defaultPaginationConfig,
        totalRecords,
        first: paginationState.first,
        rows: paginationState.rows,
      }
    : false;

  return (
    <DataTable<T>
      columns={columns}
      data={data}
      selectionMode={selectionMode}
      selection={selection}
      onSelectionChange={onSelectionChange}
      expandedRows={expandedRows}
      onRowToggle={onRowToggle}
      rowExpansionTemplate={rowExpansionTemplate}
      pagination={finalPaginationConfig}
      onPageChange={handlePageChange}
      className={className}
      containerClassName={containerClassName}
      stripedRows={stripedRows}
      loading={isLoadingState}
      emptyMessage={finalEmptyMessage}
      dataKey={dataKey}
      paginationTestId={paginationTestId}
    />
  );
}

export default DataList;
