"use client";

import React, { useMemo } from 'react';
import { Table, TextInput } from 'flowbite-react';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { Pagination } from '../../shared/pagination';
import { TablePagination } from '../../shared/table-pagination';
import { MasterRawMaterialItemsModel, MasterRawMaterialRequestModel } from '@/app/core/models/master/raw-material/raw-material.model';
import { MASTER_RAW_MATERIAL_MOCKS } from '@/app/core/models/_mock/raw-material-data.mock';

const MasterRawMaterialList = () => {
  // --- [ลบ] State ทั้งหมดนี้จะถูกย้ายไปจัดการใน useServerSideTable hook ---
  // const [data, setData] = useState<Policy[]>(() => [...mockData]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [sorting, setSorting] = useState<SortingState>([]);

  // --- [เพิ่ม] ฟังก์ชัน Handler ยังคงอยู่ที่นี่ได้ ---
  const handleEdit = (item: MasterRawMaterialItemsModel) => {
    alert(`แก้ไข: ${item.rawMaterialObjectId} - ${item.nameThai}`);
  };

  const handleDelete = (item: MasterRawMaterialItemsModel) => {
    if (window.confirm(`ลบ: ${item.nameThai}?`)) {
      alert(`ลบ ${item.rawMaterialObjectId} เรียบร้อย`);
    }
  };

  // --- [แก้ไข] ปรับปรุง Columns Definition ---
  const columns = useMemo<ColumnDef<MasterRawMaterialItemsModel>[]>(
    () => [
      // ลำดับที่
    {
      id: 'no',
      header: 'ลำดับ',
      cell: (info) => 
        info.row.index + 1 + 
        (info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize),
      size: 60,
      enableSorting: false,
    },
    // รหัสวัตถุดิบ
    {
      accessorKey: 'materialId',
      header: 'รหัสวัตถุดิบ',
      size: 150,
    },
    // ชื่อวัตถุดิบ (ไทย)
    {
      accessorKey: 'nameThai',
      header: ({ column }) => (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
          ชื่อวัตถุดิบ (ไทย)
          {column.getIsSorted() === 'asc' ? <Icon icon="akar-icons:arrow-up" /> : column.getIsSorted() === 'desc' ? <Icon icon="akar-icons:arrow-down" /> : null}
        </button>
      ),
      size: 250,
    },
    // ชื่อวัตถุดิบ (อังกฤษ)
    {
      accessorKey: 'nameEng',
      header: ({ column }) => (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
          ชื่อวัตถุดิบ (อังกฤษ)
          {column.getIsSorted() === 'asc' ? <Icon icon="akar-icons:arrow-up" /> : column.getIsSorted() === 'desc' ? <Icon icon="akar-icons:arrow-down" /> : null}
        </button>
      ),
      size: 250,
    },
    // หมวดหมู่
    {
      accessorKey: 'categoryName',
      header: 'หมวดหมู่',
      size: 150,
    },
    // พลังงาน (kcal)
    {
      accessorKey: 'energy_kcal',
      header: 'พลังงาน (kcal)',
      cell: (info) => info.getValue()?.toLocaleString() ?? 'N/A', // จัดรูปแบบตัวเลข
      size: 150,
    },
    // โปรตีน (g)
    {
      accessorKey: 'protein_g',
      header: 'โปรตีน (g)',
      cell: (info) => info.getValue()?.toLocaleString() ?? 'N/A',
      size: 120,
    },
    // คาร์โบไฮเดรต (g)
    {
      accessorKey: 'carbohydrate_g',
      header: 'คาร์บ (g)',
      cell: (info) => info.getValue()?.toLocaleString() ?? 'N/A',
      size: 120,
    },
    // ไขมัน (g)
    {
      accessorKey: 'fatTotal_g',
      header: 'ไขมัน (g)',
      cell: (info) => info.getValue()?.toLocaleString() ?? 'N/A',
      size: 120,
    },
    // สถานะ
    {
      accessorKey: 'status',
      header: 'สถานะ',
      cell: (info) => {
        // const status = info.getValue();
        // const colorClass = status === 'ACTIVE' ? 'text-green-600' : 'text-red-600';
        // return <span className={`font-semibold ${colorClass}`}>{status}</span>;
      },
      size: 100,
    },
    // จัดการ
    {
      id: 'actions',
      header: 'จัดการ',
      cell: (info) => (
        console.log(info,"info")
        
        // <div className="flex items-center justify-center gap-2">
        //   <button onClick={() => handleEdit(row.)} className="text-blue-600 hover:text-blue-800" title="แก้ไข">
        //     <Icon icon="mdi:pencil" width="20" />
        //   </button>
        //   <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-800" title="ลบ">
        //     <Icon icon="mdi:trash-can-outline" width="20" />
        //   </button>
        // </div>
      ),
      size: 120,
    },
    ],
    [] // dependency array ว่างไว้ เพราะ handleEdit/handleDelete ควรถูก memoized ถ้าจำเป็น
  );

  // --- [เปลี่ยน] เรียกใช้ Custom Hook เพื่อจัดการ Logic ทั้งหมด ---
  const { table, isLoading } = useServerSideTable<MasterRawMaterialItemsModel>({
    columns,
    apiUrl: '/api/providers/search', // URL ของ API ที่จะค้นหา
    initialPageSize: 10,
    initialCriteria: new MasterRawMaterialRequestModel(),

    // --- สวิตช์สำหรับโหมดจำลอง ---
    useMock: true, // <--- เปิดใช้งานโหมดจำลอง
    mockData: MASTER_RAW_MATERIAL_MOCKS, // <--- ส่งข้อมูลจำลองเข้าไป
  });

  // --- [ลบ] ไม่จำเป็นต้องสร้าง table instance เองอีกต่อไป ---
  // const table = useReactTable({ ... });

  // Render UI
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      {/* 
        [เพิ่ม] UI สำหรับ Loading 
        ถ้าใช้ GlobalSpinner ที่คุมโดย Zustand/Redux ผ่าน Interceptor ไม่จำเป็นต้องมีบรรทัดนี้
        แต่ถ้าอยากให้ loading เฉพาะส่วนตาราง ให้ใช้บรรทัดนี้
      */}
      {isLoading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">Loading...</div>}

      <div className="relative overflow-x-auto">
        <Table className="table-fixed border w-full">
          <thead className="text-xs text-gray-700 uppercase bg-indigo-100 dark:bg-indigo-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col" className="p-4 align-top border" style={{ width: header.getSize() }}>
                    <div className="flex flex-col gap-3">
                      <div className="font-bold text-sm text-gray-600 dark:text-gray-300 flex justify-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                      {header.column.getCanFilter() && (
                        <TextInput
                          id={header.id}
                          type="text"
                          value={(header.column.getFilterValue() as string) ?? ''}
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder="ค้นหา..."
                          className="form-control form-rounded-xl"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white border dark:bg-gray-800 dark:border-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 font-medium border text-gray-900 whitespace-nowrap dark:text-white align-middle text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* --- [เพิ่ม] เพิ่ม Component Pagination และส่ง table instance เข้าไป --- */}
      <TablePagination table={table} />
    </div>
  );
};

export default MasterRawMaterialList;