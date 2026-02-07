'use client';

import React, { useCallback, useMemo, useState } from 'react';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';

import { Pagination } from '@/components/data/pagination';

type RecordItem = {
  id: number;
  name: string;
  category: string;
  status: string;
};

export default function PaginationExample() {
  const rowsPerPageOptions = useMemo(() => [10, 25, 50], []);
  const mockData = useMemo<RecordItem[]>(() => {
    const categories = [
      'Safety Training',
      'Machine Operation',
      'Maintenance',
      'Compliance',
    ];
    const statuses = ['Scheduled', 'In Progress', 'Completed'];

    return Array.from({ length: 76 }, (_, index) => ({
      id: index + 1,
      name: `Course ${(index + 1).toString().padStart(2, '0')}`,
      category: categories[index % categories.length],
      status: statuses[index % statuses.length],
    }));
  }, []);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(rowsPerPageOptions[0]);

  const totalRecords = mockData.length;

  const handlePageChange = useCallback((event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  }, []);

  return (
    <Pagination
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPageChange={handlePageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      pageLinkSize={5}
      className="bg-transparent max-w-4xl mx-auto"
    />
  );
}
