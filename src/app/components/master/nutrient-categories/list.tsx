"use client";

import React, { useCallback, useMemo } from 'react';
import { Button, Table, TextInput } from 'flowbite-react';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { TablePagination } from '../../shared/table-pagination';
import { useTranslation } from 'react-i18next';
import { TableStatusRow } from '../../shared/table-status-row';
import { useModal } from '@/app/core/hooks/use-modal';
import { showDeleteConfirm, showSuccessAlert } from '@/app/lib/swal';
import { NutrientCategoriesModal, NutrientCategoriesModalProps } from './modals/editor-nutrient-categories-modal';
import { MasterNutrientCategoriesItemsModel, MasterNutrientCategoriesRequestModel } from '@/app/core/models/master/nutrient-categories/nutrient-categories.model';
import { MASTER_NUTRIENT_CATEGORIES_MOCKS } from '@/app/core/models/_mock/nutrient-categories-data.mock';
import { ApiSearchRequest } from '@/app/core/models/shared/page.model';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';

const MasterNutrientCategoriesList = () => {
  const { t } = useTranslation();
  const showFoodGroupModal = useModal<NutrientCategoriesModalProps, any>(NutrientCategoriesModal);

  // --- [แก้ไข] ปรับปรุง Columns Definition ---
  const columns = useMemo<ColumnDef<MasterNutrientCategoriesItemsModel>[]>(
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
        header: t('master.ncCode'),
        size: 150,
      },
      {
        accessorKey: 'nameEng',
        header: ({ column }) => (
          <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
            {t('master.ncName')} ({t('system.language.en')})
            {column.getIsSorted() === 'asc' ? <Icon icon="akar-icons:arrow-up" /> : column.getIsSorted() === 'desc' ? <Icon icon="akar-icons:arrow-down" /> : null}
          </button>
        ),
        size: 250,
      },
      {
        accessorKey: 'nameThai',
        header: ({ column }) => (
          <button className="flex items-center gap-2" onClick={() => column.toggleSorting()}>
            {t('master.ncName')} ({t('system.language.th')})
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
              <button onClick={() => handleView(item)} className="text-blue-600 hover:text-blue-800" title="ดู">
                <Icon icon="mdi:eye" width="20" />
              </button>
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

  const initialCriteria = useMemo(() => new MasterNutrientCategoriesRequestModel(), []);
  const USE_MOCK_DATA = true;
    // --- Data Fetching Logic ---
  // const realFetchFn = useCallback((request: ApiSearchRequest) => {
  //     console.log('[MasterList] fetchDataFunction is called. Service instance is ready.');
  //     return ingredientGroupService.search(request);
  // }, [ingredientGroupService]);
  const mockFetchFn = useCallback(createMockFetchFn(MASTER_NUTRIENT_CATEGORIES_MOCKS), []);
  const fetchDataFunction = USE_MOCK_DATA && mockFetchFn;

  const { table, isLoading, refetch } = useServerSideTable<MasterNutrientCategoriesItemsModel>({
    fetchDataFn: fetchDataFunction,
    columns,
    initialPageSize: 10,
    initialCriteria: initialCriteria,
  });


  const handleCreate = async () => {
    try {
      // เรียกใช้โหมด 'create' และปรับขนาดเป็น 'lg'
      const newGroup = await showFoodGroupModal({ mode: 'create', size: 'lg:max-w-3xl lg:min-w-[700px]' });
      alert(`สร้างกลุ่มใหม่สำเร็จ: ${newGroup.name}`);
      // TODO: เพิ่ม newGroup เข้าไปใน state ของตาราง
    } catch (error) {
      console.info('การสร้างถูกยกเลิก');
    }
  };

  const handleEdit = async (item: MasterNutrientCategoriesItemsModel) => {
    try {
      // เรียกใช้โหมด 'edit' พร้อมส่งข้อมูลเริ่มต้น
      const updatedGroup = await showFoodGroupModal({
        mode: 'edit',
        id: item.objectId,
        size: 'lg:max-w-3xl lg:min-w-[700px]'
      });
      alert(`แก้ไขสำเร็จ: ${updatedGroup.name}`);
      // TODO: อัปเดตข้อมูล group ใน state ของตาราง
    } catch (error) {
      console.info('การแก้ไขถูกยกเลิก');
    }
  };

  const handleView = (item: MasterNutrientCategoriesItemsModel) => {
    // โหมด View ไม่จำเป็นต้อง await เพราะเรามักจะไม่สนใจผลลัพธ์
    showFoodGroupModal({ mode: 'view', id: item.objectId, size: 'lg:max-w-3xl lg:min-w-[700px]' });
  };


  const handleDelete = async (item: MasterNutrientCategoriesItemsModel) => {
    try {
      // 2. เรียกใช้ฟังก์ชัน showDeleteConfirm และ "await" ผลลัพธ์
      // ส่งชื่อของ item เข้าไปเพื่อให้ข้อความดูเป็นมิตร
      const result = await showDeleteConfirm(item.materialId);

      // 3. ตรวจสอบผลลัพธ์ที่ได้กลับมา
      // `result.isConfirmed` จะเป็น true ถ้าผู้ใช้กดปุ่ม "ยืนยัน" (ใช่, ลบเลย)
      if (result.isConfirmed) {
        console.log(`กำลังลบ ${item.nameThai}...`);
        // TODO: ใส่ Logic การเรียก API เพื่อลบข้อมูลจริงที่นี่

        // เมื่อลบสำเร็จ อาจจะแสดง Alert อีกอัน
        showSuccessAlert('ลบสำเร็จ!', `${item.nameThai} ถูกลบแล้ว`);

        // TODO: โหลดข้อมูลตารางใหม่
        refetch();
      } else if (result.isDismissed) {
        // `result.isDismissed` จะเป็น true ถ้าผู้ใช้กด "ยกเลิก" หรือคลิกนอก Modal
        console.log('การลบถูกยกเลิก');
      }
    } catch (error) {
      // ดักจับข้อผิดพลาดที่ไม่คาดคิด
      console.error('เกิดข้อผิดพลาดระหว่างการยืนยัน:', error);
    }
  };

  // Render UI
  return (
    <div className="panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <h2 className="panel-title">
            {t('master.ncList')} {/* หรือชื่อหัวตาราง */}
          </h2>
          <Button onClick={handleCreate} size={'md'} color={'success'} className='btn'>
            <Icon icon="mdi:plus" className="h-5 w-5" />
            {t('system.create')} {/* หรือ "สร้างใหม่" */}
          </Button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="panel-body">
        <div className="responsive-table-container">
          <div className="responsive-table-scroll-wrapper">
            <Table className="responsive-table">
              <thead className="responsive-table-header bg-indigo-100 dark:bg-indigo-700 dark:text-gray-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="w-auto p-4 align-top border whitespace-nowrap"
                        style={{ width: header.column.getSize() !== 150 ? header.getSize() : undefined }}
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

        </div>
        <TablePagination table={table} />
      </div>

    </div>

  );
};

export default MasterNutrientCategoriesList;