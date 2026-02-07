'use client';

import { useMemo } from 'react';
import DataTable, { DataTableColumn } from '@/components/data/datatable';

type MaintenanceOrder = {
  id: string;
  asset: string;
  location: string;
  technician: string;
  hours: number;
  dueDate: string;
};

const maintenanceOrders: MaintenanceOrder[] = [
  {
    id: 'WO-1024',
    asset: 'PC200-10 Excavator',
    location: 'Jakarta Yard',
    technician: 'S. Hartono',
    hours: 1248,
    dueDate: '2025-01-18',
  },
  {
    id: 'WO-1025',
    asset: 'HD785-7 Dump Truck',
    location: 'Samarinda Mine',
    technician: 'A. Prasetyo',
    hours: 3012,
    dueDate: '2025-01-12',
  },
  {
    id: 'WO-1026',
    asset: 'WA480-8 Wheel Loader',
    location: 'Bontang Quarry',
    technician: 'M. Wijaya',
    hours: 2204,
    dueDate: '2025-01-05',
  },
  {
    id: 'WO-1027',
    asset: 'GD675-6 Grader',
    location: 'Balikpapan Workshop',
    technician: 'L. Suryani',
    hours: 1640,
    dueDate: '2025-01-27',
  },
  {
    id: 'WO-1028',
    asset: 'PC360LC-11 Excavator',
    location: 'Makassar Port',
    technician: 'R. Nugroho',
    hours: 940,
    dueDate: '2024-12-29',
  },
  {
    id: 'WO-1029',
    asset: 'PC360LC-11 Excavator',
    location: 'Makassar Port',
    technician: 'R. Nugroho',
    hours: 940,
    dueDate: '2024-12-29',
  },
  {
    id: 'WO-1030',
    asset: 'PC360LC-11 Excavator',
    location: 'Makassar Port',
    technician: 'R. Nugroho',
    hours: 940,
    dueDate: '2024-12-29',
  },
  {
    id: 'WO-1031',
    asset: 'PC360LC-11 Excavator',
    location: 'Makassar Port',
    technician: 'R. Nugroho',
    hours: 940,
    dueDate: '2024-12-29',
  },
  {
    id: 'WO-1032',
    asset: 'PC360LC-11 Excavator',
    location: 'Makassar Port',
    technician: 'R. Nugroho',
    hours: 940,
    dueDate: '2024-12-29',
  },
];

export default function MaintenanceOrdersDataTable() {
  const columns = useMemo<DataTableColumn<MaintenanceOrder>[]>(
    () => [
      {
        field: 'id',
        header: 'Work Order',
        sortable: true,
        style: { minWidth: '10rem' },
      },
      {
        field: 'asset',
        header: 'Asset',
        sortable: true,
        style: { minWidth: '14rem' },
      },
      {
        field: 'location',
        header: 'Location',
        sortable: true,
        style: { minWidth: '12rem' },
      },
      {
        field: 'technician',
        header: 'Technician',
        sortable: true,
        style: { minWidth: '12rem' },
      },
      {
        field: 'hours',
        header: 'Hours',
        sortable: true,
        style: { minWidth: '8rem' },
      },
      {
        field: 'dueDate',
        header: 'Due Date',
        sortable: true,
        style: { minWidth: '10rem' },
      },
      {
        field: 'dueDate1',
        header: 'Due Date',
        sortable: true,
        style: { minWidth: '10rem' },
      },
      {
        field: 'dueDate2',
        header: 'Due Date',
        sortable: true,
        style: { minWidth: '10rem' },
      },
      {
        field: 'dueDate3',
        header: 'Due Date',
        sortable: true,
        style: { minWidth: '10rem' },
      },
      {
        field: 'action',
        header: 'Action',
        sortable: false,
        style: { minWidth: '10rem' },
        frozen: true,
      },
    ],
    []
  );

  return (
    <div className="p-6 mx-auto space-y-6">
      <DataTable
        data={maintenanceOrders}
        columns={columns}
        pagination={{ rows: 5, rowsPerPageOptions: [5, 10, 20] }}
        stripedRows
        selectionMode="checkbox"
        dataKey="id"
        containerClassName="shadow-200 rounded-md bg-white border-system"
      />
    </div>
  );
}
