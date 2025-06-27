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
import { useTranslation } from 'react-i18next';
import { TableStatusRow } from '../../shared/table-status-row';

const MasterFoodGroupsList = () => {
  const { t } = useTranslation();
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
      {
        id: 'no',
        header: t('system.no'),
        cell: (info) =>
          info.row.index + 1 +
          (info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize),
        size: 60,
        enableSorting: false,
      },
      {
        accessorKey: 'materialId',
        header: t('master.fgCode'),
        size: 150,
      },
      {
        accessorKey: 'nameEng',
        header: ({ column }) => (
          <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
            {t('master.fgName')} ({t('system.language.en')})
            {column.getIsSorted() === 'asc' ? <Icon icon="akar-icons:arrow-up" /> : column.getIsSorted() === 'desc' ? <Icon icon="akar-icons:arrow-down" /> : null}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: 'nameThai',
        header: ({ column }) => (
          <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
            {t('master.fgName')} ({t('system.language.th')})
            {column.getIsSorted() === 'asc' ? <Icon icon="akar-icons:arrow-up" /> : column.getIsSorted() === 'desc' ? <Icon icon="akar-icons:arrow-down" /> : null}
          </button>
        ),
        size: 250,
      },
      // จัดการ
      {
        id: 'actions',
        header: t('system.action'),
        cell: (info) => {
          const item = info.row.original; // ดึงข้อมูล item ของแถวนี้

          return (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800" title="แก้ไข">
                <Icon icon="mdi:pencil" width="20" />
              </button>
              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800" title="ลบ">
                <Icon icon="mdi:trash-can-outline" width="20" />
              </button>
            </div>
          );
        },
        size: 120,
      },
    ],
    [] // dependency array ว่างไว้ เพราะ handleEdit/handleDelete ควรถูก memoized ถ้าจำเป็น
  );

  const initialCriteria = useMemo(() => new MasterRawMaterialRequestModel(), []);
  const mockData = useMemo(() => [], []);

  // --- [เปลี่ยน] เรียกใช้ Custom Hook เพื่อจัดการ Logic ทั้งหมด ---
  const { table, isLoading } = useServerSideTable<MasterRawMaterialItemsModel>({
    columns,
    apiUrl: '/ingredient-group/search', // URL ของ API ที่จะค้นหา
    initialPageSize: 10,
    initialCriteria: initialCriteria,

    // --- สวิตช์สำหรับโหมดจำลอง ---
    useMock: false, // <--- เปิดใช้งานโหมดจำลอง
    mockData: mockData
  });

  // --- [ลบ] ไม่จำเป็นต้องสร้าง table instance เองอีกต่อไป ---
  // const table = useReactTable({ ... });

  // Render UI
  return (
    <div className="panel">
      {/* Panel Header */}
      <div className="panel-header">
        <h2 className="panel-title">
          {t('master.fgList')} {/* หรือชื่อหัวตาราง */}
        </h2>
      </div>

      {/* Panel Body */}
      <div className="panel-body">
        <div className="relative overflow-x-auto">
          <Table className="table-fixed border w-full">
            <thead className="text-xs text-gray-700 bg-indigo-100 dark:bg-indigo-700 dark:text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="p-4 align-top border"
                      style={{ width: header.getSize() }}
                    >
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border dark:bg-gray-800 dark:border-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 font-medium border text-gray-900 whitespace-nowrap dark:text-white align-middle text-center"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <TableStatusRow colSpan={columns.length} status="no-data" />
              )
              }

            </tbody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>

      {/* Panel Footer */}
      <div className="panel-footer">

      </div>
    </div>

  );
};

export default MasterFoodGroupsList;