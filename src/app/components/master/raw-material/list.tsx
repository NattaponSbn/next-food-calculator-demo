"use client";

import React, { useState, useMemo } from 'react';
import { Table, TextInput } from 'flowbite-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Icon } from '@iconify/react';

// 1. สร้าง Type/Interface สำหรับข้อมูลของเรา
interface Policy {
  policyNo: string;
  natId: string;
  clientName: string;
}

// 2. สร้างข้อมูลตัวอย่าง (ในชีวิตจริงจะมาจาก API)
const mockData: Policy[] = [
  { policyNo: 'HB102C001', natId: '1879955114780', clientName: 'ธีรศักดิ์ ทรงสุวรรณ' },
  { policyNo: 'PC231A015', natId: '3102201994551', clientName: 'สมหญิง ใจดี' },
  { policyNo: 'AZ998B112', natId: '1234567890123', clientName: 'John Doe' },
  { policyNo: 'HB105C999', natId: '9876543210987', clientName: 'Peter Jones' },
  { policyNo: 'PC111A007', natId: '5551112223334', clientName: 'พรเทพ รักการงาน' },
];

// 3. สร้างคอมโพเนนต์ตาราง
const MasterRawMaterialList = () => {
  // State สำหรับจัดการการทำงานของตาราง
  const [data] = useState<Policy[]>(() => [...mockData]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // 4. นิยามคอลัมน์และ Header ที่เราต้องการ
  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        accessorKey: 'policyNo',
        // ใช้ฟังก์ชัน header เพื่อสร้าง UI ที่ซับซ้อนได้
        header: ({ column }) => (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Policy No
            {/* แสดงไอคอนตามสถานะการเรียง */}
            {column.getIsSorted() === 'asc' && <Icon icon="akar-icons:arrow-up" />}
            {column.getIsSorted() === 'desc' && <Icon icon="akar-icons:arrow-down" />}
          </button>
        ),
      },
      {
        accessorKey: 'natId',
        header: ({ column }) => (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nat_ID
            {column.getIsSorted() === 'asc' && <Icon icon="akar-icons:arrow-up" />}
            {column.getIsSorted() === 'desc' && <Icon icon="akar-icons:arrow-down" />}
          </button>
        ),
      },
      {
        accessorKey: 'clientName',
        header: ({ column }) => (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client Name
            {column.getIsSorted() === 'asc' && <Icon icon="akar-icons:arrow-up" />}
            {column.getIsSorted() === 'desc' && <Icon icon="akar-icons:arrow-down" />}
          </button>
        ),
      },
    ],
    []
  );

  // 5. สร้าง instance ของตารางด้วย useReactTable
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 6. Render UI ด้วยคอมโพเนนต์ของ Flowbite-React
  return (
 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="overflow-x-auto">
        <Table hoverable className="table-fixed w-full">
          {/********** [แก้ไข] ใช้ <thead> และ <tbody> โดยตรง **********/}
          
          {/* ใช้ <thead> แทน <Table.Head> */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  // ไม่ใช้ <Table.HeadCell> แต่ใช้ <th> พร้อมคลาสที่จำเป็น
                  <th 
                    key={header.id}
                    scope="col"
                    className={`
                      p-4 align-top
                      ${header.column.id === 'policyNo' && 'w-[25%]'}
                      ${header.column.id === 'natId' && 'w-[35%]'}
                      ${header.column.id === 'clientName' && 'w-[40%]'}
                    `}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="font-semibold text-gray-600 dark:text-gray-300 cursor-pointer flex justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {header.column.getCanFilter() && (
                        <TextInput
                          id={header.id}
                          type="text"
                          value={(header.column.getFilterValue() as string) ?? ''}
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder={
                            header.column.id === 'policyNo' ? 'Policy No' :
                            header.column.id === 'natId' ? 'Nat ID' :
                            'Client Name'
                          }
                          sizing="sm"
                          className="w-full !rounded-lg"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ใช้ <tbody> แทน <Table.Body> */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {row.getVisibleCells().map((cell) => (
                   // ไม่ใช้ <Table.Cell> แต่ใช้ <td> พร้อมคลาสที่จำเป็น
                  <td key={cell.id} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MasterRawMaterialList;

