"use client";

import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Table, TextInput } from 'flowbite-react';
import { Column, flexRender, type ColumnDef } from '@tanstack/react-table';
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
import { FilterControl } from '../../shared/filterable-header';
import { SortableHeader } from '../../shared/sortable-header';
import { nutritionGroupService } from '@/app/core/services/master/nutrition-group.service';

const MasterNutrientCategoriesList = () => {
  const { t } = useTranslation();
  const showFoodGroupModal = useModal<NutrientCategoriesModalProps, any>(NutrientCategoriesModal);

  const handleOpenFilter = async (
    event: React.MouseEvent<HTMLButtonElement>,
    column: Column<any, any> // รับ column instance เข้ามา
  ) => {
    const filterType = column.columnDef.meta?.filterType;
    const columnId = column.id; // <-- ใช้ ID ของคอลัมน์ในการตัดสินใจ
    const currentValue = column.getFilterValue();

    // สร้าง Title แบบ Dynamic จาก Header ของคอลัมน์
    const filterTitle = `${t('system.filter')} : ${String(column.columnDef.header)}`;

    let result;

    // --- ใช้ switch-case หรือ if-else เพื่อจัดการตามประเภทและ ID ---
    switch (filterType) {
      // สามารถเพิ่ม case 'text', 'numberRange' ฯลฯ ได้ในอนาคต
      default:
        console.warn(`No filter implemented for type: ${filterType}`);
        return;
    }

    if (result?.applied) {
      column.setFilterValue(result.value);
    }
  };

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
        accessorKey: 'code',
        header: ({ column }) => (
          <FilterControl
            column={column}
            title={t('master.ncCode')}
            placeholder={t('master.ncCode')}
            meta={{ filterType: 'text' }}
            onFilterIconClick={handleOpenFilter}
          />
        ),
        size: 120,
      },
      {
        accessorKey: 'nameEN',
        header: ({ column }) => (
          <div className="flex flex-col items-center justify-center gap-2">

            {/* ส่วนที่ 1: Title และปุ่ม Sort */}
            <SortableHeader column={column}>
              {`${t('master.ncName')} (${t('system.language.en')})`}
            </SortableHeader>

            {/* ส่วนที่ 2: Filter Control */}
            <FilterControl
              column={column}
              placeholder={`${t('master.ncName')} (${t('system.language.en')})`}
              meta={{ filterType: 'text' }} // <-- กำหนด filter type
              onFilterIconClick={handleOpenFilter}
            />
          </div>
        ),
        size: 250,
         cell: (info) => (
            <span className='text-start block text-wrap'>{info.getValue<string>() ?? '-'}</span>
          ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <div className="flex flex-col items-center justify-center gap-2">

            {/* ส่วนที่ 1: Title และปุ่ม Sort */}
            <SortableHeader column={column}>
              {`${t('master.nName')} (${t('system.language.th')})`}
            </SortableHeader>

            {/* ส่วนที่ 2: Filter Control */}
            <FilterControl
              column={column}
              placeholder={`${t('master.nName')} (${t('system.language.th')})`}
              meta={{ filterType: 'text' }} // <-- กำหนด filter type
              onFilterIconClick={handleOpenFilter}
            />
          </div>
        ),
        size: 250,
         cell: (info) => (
            <span className='text-start block text-wrap'>{info.getValue<string>() ?? '-'}</span>
          ),
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
  const USE_MOCK_DATA = false;
  // --- Data Fetching Logic ---
  const realFetchFn = useCallback((request: ApiSearchRequest) => {
    return nutritionGroupService.search(request);
  }, [nutritionGroupService]);
  const mockFetchFn = useCallback(createMockFetchFn(MASTER_NUTRIENT_CATEGORIES_MOCKS), []);
  // const fetchDataFunction = USE_MOCK_DATA && mockFetchFn;
  const fetchDataFunction = realFetchFn;

  const { table, isLoading, refetch } = useServerSideTable<MasterNutrientCategoriesItemsModel>({
    fetchDataFn: fetchDataFunction,
    columns,
    initialPageSize: 10,
    initialCriteria: initialCriteria,
  });

  useEffect(() => {
    refetch();
  }, [refetch]); // ใช้ refetch เป็น dependency

  const handleCreate = async () => {
    try {
      // เรียกใช้โหมด 'create' และปรับขนาดเป็น 'lg'
      const newGroup = await showFoodGroupModal({ mode: 'create', size: 'lg:max-w-3xl lg:min-w-[700px]' });
      refetch();
    } catch (error) {
      console.info('การสร้างถูกยกเลิก');
    }
  };

  const handleEdit = async (item: MasterNutrientCategoriesItemsModel) => {
    try {
      // เรียกใช้โหมด 'edit' พร้อมส่งข้อมูลเริ่มต้น
      const updatedGroup = await showFoodGroupModal({
        mode: 'edit',
        id: item.id,
        size: 'lg:max-w-3xl lg:min-w-[700px]'
      });
      refetch();
    } catch (error) {
      console.info('การแก้ไขถูกยกเลิก');
    }
  };

  const handleView = (item: MasterNutrientCategoriesItemsModel) => {
    // โหมด View ไม่จำเป็นต้อง await เพราะเรามักจะไม่สนใจผลลัพธ์
    showFoodGroupModal({ mode: 'view', id: item.id, size: 'lg:max-w-3xl lg:min-w-[700px]' });
  };


  const handleDelete = async (item: MasterNutrientCategoriesItemsModel) => {
    try {
      // 2. เรียกใช้ฟังก์ชัน showDeleteConfirm และ "await" ผลลัพธ์
      // ส่งชื่อของ item เข้าไปเพื่อให้ข้อความดูเป็นมิตร
      const result = await showDeleteConfirm(item.materialId);

      // 3. ตรวจสอบผลลัพธ์ที่ได้กลับมา
      // `result.isConfirmed` จะเป็น true ถ้าผู้ใช้กดปุ่ม "ยืนยัน" (ใช่, ลบเลย)
      if (result.isConfirmed) {
        const result = await nutritionGroupService.delete(item.id);
        if (!result) return;
        // เมื่อลบสำเร็จ อาจจะแสดง Alert อีกอัน
        showSuccessAlert('ลบสำเร็จ!', `${item.name} ถูกลบแล้ว`);

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
            <Table className="responsive-table table-separated">
              <thead className="responsive-table-header bg-indigo-100 dark:bg-indigo-700 dark:text-gray-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="w-auto p-4 align-top border whitespace-nowrap"
                        style={{ width: header.getSize() }}
                      >
                      {flexRender(header.column.columnDef.header, header.getContext())}
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