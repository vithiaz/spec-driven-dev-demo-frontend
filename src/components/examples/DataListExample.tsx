'use client';

import { useState } from 'react';
import { DataTableColumn } from '@/components/data';
import { DataList } from '@/components/common';

import { FormInputText } from '@/components/form';
import { Tag } from '@/components/misc';
import { Button } from 'primereact/button';
import { formatDate } from '@/utils';

interface Book {
  id: number;
  title: string;
  author: string | null;
  created_at: string | null;
}

export default function DataListExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [sortField, setSortField] = useState<'title' | 'created_at'>(
    'created_at'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [serverSidePagination, setServerSidePagination] = useState(false);

  const columns: DataTableColumn<Book>[] = [
    {
      field: 'id',
      header: 'ID',
      sortable: true,
      frozen: true,
      style: { width: '80px' },
    },
    {
      field: 'title',
      header: 'Title',
      sortable: true,
      style: { minWidth: '250px' },
      body: (data) => (
        <div className="font-semibold text-gray-900">{data.title}</div>
      ),
    },
    {
      field: 'author',
      header: 'Author',
      sortable: true,
      style: { minWidth: '180px' },
      body: (data) => (
        <div className="text-gray-700">
          {data.author || <span className="text-gray-400 italic">Unknown</span>}
        </div>
      ),
    },
    {
      field: 'created_at',
      header: 'Created',
      sortable: true,
      style: { minWidth: '150px' },
      body: (data) => (
        <div className="text-sm">
          {data.created_at ? (
            <>
              <div className="font-medium">{formatDate(data.created_at)}</div>
              <div className="text-gray-500 text-xs mt-1">
                {new Date(data.created_at).toLocaleTimeString()}
              </div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: 'status',
      header: 'Status',
      style: { minWidth: '120px' },
      body: () => <Tag value="Available" severity="success" />,
    },
    {
      field: 'actions',
      header: 'Actions',
      frozen: true,
      frozenPosition: 'right',
      style: { width: '120px' },
      body: (data) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-eye"
            rounded
            text
            severity="info"
            tooltip="View"
            onClick={() => alert(`View book: ${data.title}`)}
          />
          <Button
            icon="pi pi-pencil"
            rounded
            text
            tooltip="Edit"
            onClick={() => alert(`Edit book: ${data.title}`)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            text
            severity="danger"
            tooltip="Delete"
            onClick={() => alert(`Delete book: ${data.title}`)}
          />
        </div>
      ),
    },
  ];

  const handleSortChange = (field: 'title' | 'created_at') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleBulkDelete = () => {
    if (selectedBooks.length === 0) return;
    const confirm = window.confirm(
      `Are you sure you want to delete ${selectedBooks.length} book(s)?`
    );
    if (confirm) {
      alert(`Deleted ${selectedBooks.length} books`);
      setSelectedBooks([]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          DataList Example
        </h1>
        <p className="text-gray-600">
          Demonstrating DataList component with Supabase integration, search,
          sorting, and selection
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <i className="pi pi-info-circle text-blue-500 text-xl"></i>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Data is automatically fetched from Supabase{' '}
                <code className="bg-blue-100 px-1 rounded">books</code> table
              </li>
              <li>• Search filters across multiple fields (title, author)</li>
              <li>• Sorting updates the query dynamically</li>
              <li>
                • <strong>Client-side pagination:</strong> All data loaded,
                paginated in browser
              </li>
              <li>
                • <strong>Server-side pagination:</strong> Only current page
                loaded from database
              </li>
              <li>
                • Realtime updates enabled - changes reflect automatically
              </li>
              <li>• Selection supports multi-select with checkboxes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <FormInputText
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<i className="pi pi-search" />}
              className="w-full"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              label={serverSidePagination ? 'Server-side' : 'Client-side'}
              icon={serverSidePagination ? 'pi pi-server' : 'pi pi-desktop'}
              onClick={() => setServerSidePagination(!serverSidePagination)}
              severity={serverSidePagination ? 'success' : 'secondary'}
              size="small"
              tooltip={`Switch to ${serverSidePagination ? 'client-side' : 'server-side'} pagination`}
            />
            <Button
              label="Sort by Title"
              icon={
                sortField === 'title'
                  ? sortOrder === 'asc'
                    ? 'pi pi-sort-alpha-down'
                    : 'pi pi-sort-alpha-up'
                  : 'pi pi-sort'
              }
              onClick={() => handleSortChange('title')}
              outlined={sortField !== 'title'}
              size="small"
            />
            <Button
              label="Sort by Date"
              icon={
                sortField === 'created_at'
                  ? sortOrder === 'asc'
                    ? 'pi pi-sort-amount-up'
                    : 'pi pi-sort-amount-down'
                  : 'pi pi-sort'
              }
              onClick={() => handleSortChange('created_at')}
              outlined={sortField !== 'created_at'}
              size="small"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBooks.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <i className="pi pi-check-circle text-blue-600"></i>
            <span className="font-medium text-blue-900">
              {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''}{' '}
              selected
            </span>
            <div className="flex-1"></div>
            <Button
              label="Clear Selection"
              icon="pi pi-times"
              size="small"
              text
              onClick={() => setSelectedBooks([])}
            />
            <Button
              label={`Delete ${selectedBooks.length}`}
              icon="pi pi-trash"
              severity="danger"
              size="small"
              onClick={handleBulkDelete}
            />
          </div>
        )}
      </div>

      {/* DataList */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataList<Book>
          table="user-profile"
          columns={columns}
          select="*"
          search={
            searchTerm
              ? {
                  value: searchTerm,
                  fields: ['title', 'author'],
                }
              : undefined
          }
          sort={{ field: sortField, order: sortOrder }}
          pagination={{
            rows: 10,
            rowsPerPageOptions: [5, 10, 25, 50],
            showPageInfo: true,
            showPrevNext: true,
            showPageNumbers: true,
          }}
          serverSidePagination={serverSidePagination}
          selectionMode="checkbox"
          selection={selectedBooks}
          onSelectionChange={(e) => setSelectedBooks(e.value as Book[])}
          enableRealtime={true}
          stripedRows
          dataKey="id"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Pagination Mode</div>
          <div className="text-lg font-bold text-gray-900 capitalize">
            {serverSidePagination ? 'Server-side' : 'Client-side'}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Books</div>
          <div className="text-2xl font-bold text-gray-900">-</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Selected</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedBooks.length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Current Sort</div>
          <div className="text-lg font-medium text-gray-900 capitalize">
            {sortField} ({sortOrder})
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-900 rounded-lg p-6 text-white space-y-4">
        <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>

        <div>
          <div className="text-sm text-gray-400 mb-2">
            Client-side Pagination (default)
          </div>
          <pre className="text-sm overflow-x-auto bg-gray-800 p-4 rounded">
            <code>{`<DataList
  table="books"
  columns={columns}
  pagination={{
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  }}
  // All data loaded, paginated in browser
/>`}</code>
          </pre>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">
            Server-side Pagination (for large datasets)
          </div>
          <pre className="text-sm overflow-x-auto bg-gray-800 p-4 rounded">
            <code>{`<DataList
  table="books"
  columns={columns}
  pagination={{
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  }}
  serverSidePagination={true}
  // Only current page loaded from database
  // Better performance for large datasets
/>`}</code>
          </pre>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">
            With Search, Sort, and Selection
          </div>
          <pre className="text-sm overflow-x-auto bg-gray-800 p-4 rounded">
            <code>{`<DataList
  table="books"
  columns={columns}
  search={{
    value: searchTerm,
    fields: ['title', 'author'],
  }}
  sort={{ field: 'created_at', order: 'desc' }}
  pagination={{ rows: 10 }}
  serverSidePagination={true}
  selectionMode="checkbox"
  selection={selectedBooks}
  onSelectionChange={(e) => setSelectedBooks(e.value)}
  enableRealtime={true}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
