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
import { formatDateEngShort } from '@/app/lib/date-helpers';
import { useFilter } from '@/app/core/hooks/use-filter';
import { FilterListItem, StatusFilter } from '../../shared/filters/status-filter';
import { DateFilter } from '../../shared/filters/date-filter';
import { FilterControl } from '../../shared/filterable-header';
import { SortableHeader } from '../../shared/sortable-header';
import { DateFilterRequestModel } from '@/app/core/models/shared/date-filter.model';
import { UnitsModal, UnitsModalProps } from './modals/editor-units-modal';
import { MasterUnitsItemsModel, MasterUnitsRequestModel } from '@/app/core/models/master/units/units.model';
import { MASTER_UNIT_MOCKS } from '@/app/core/models/_mock/units-data.mock';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';
import { ApiSearchRequest } from '@/app/core/models/shared/page.model';
import { unitsService } from '@/app/core/services/master/units.service';

const MasterUnitsList = () => {
  const { t } = useTranslation();
  const showUnitsModal = useModal<UnitsModalProps, any>(UnitsModal);
  const { showFilter } = useFilter();

  const statusOptions: FilterListItem[] = useMemo(() => [
    { id: 'PENDING', name: 'Pending' },
    { id: 'PAID', name: 'Paid' },
    { id: 'FAILED', name: 'Failed' },
  ], [t]);

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
      case 'status':
        // ตรวจสอบ ID ของคอลัมน์เพื่อส่ง 'items' ที่ถูกต้อง
        const statusItems = columnId === 'status'
          ? statusOptions
          : []; // กรณี default

        result = await showFilter(
          StatusFilter,
          {
            initialValue: currentValue as string[],
            items: statusItems,
          },
          event.currentTarget
        );
        break;

      case 'date':
        // สำหรับ Date Filter อาจจะไม่ต้องแยกกรณีถ้า UI เหมือนกัน
        result = await showFilter(
          DateFilter,
          {
            initialValue: currentValue as DateFilterRequestModel | undefined,
            title: filterTitle,
          },
          event.currentTarget
        );
        break;

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
  const columns = useMemo<ColumnDef<MasterUnitsItemsModel>[]>(
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
            title={t('master.unCode')}
            placeholder={t('master.unCode')}
            meta={{ filterType: 'text' }} // <-- กำหนด filter type
            onFilterIconClick={handleOpenFilter}
          />
        ),
        size: 200,
      },
      {
        accessorKey: 'nameEN',
        header: ({ column }) => (
          // ห่อทุกอย่างด้วย div หลัก และใช้ flex-col
          <div className="flex flex-col items-center justify-center gap-2">

            {/* ส่วนที่ 1: Title และปุ่ม Sort */}
            <SortableHeader column={column}>
              {`${t('master.unName')} (${t('system.language.en')})`}
            </SortableHeader>

            {/* ส่วนที่ 2: Filter Control */}
            <FilterControl
              column={column}
              placeholder={`${t('master.unName')} (${t('system.language.en')})`}
              meta={{ filterType: 'text' }} // <-- กำหนด filter type
              onFilterIconClick={handleOpenFilter}
            />
          </div>
        ),
        size: 200,
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
              {`${t('master.unName')} (${t('system.language.th')})`}
            </SortableHeader>

            {/* ส่วนที่ 2: Filter Control */}
            <FilterControl
              column={column}
              placeholder={`${t('master.unName')} (${t('system.language.th')})`}
              meta={{ filterType: 'text' }} // <-- กำหนด filter type
              onFilterIconClick={handleOpenFilter}
            />
          </div>
        ),
        size: 200,
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
    [statusOptions] // dependency array ว่างไว้ เพราะ handleEdit/handleDelete ควรถูก memoized ถ้าจำเป็น
  );

  const initialCriteria = useMemo(() => new MasterUnitsRequestModel(), []);

  const USE_MOCK_DATA = false;
  const realFetchFn = useCallback((request: ApiSearchRequest) => {
    return unitsService.search(request);
  }, [unitsService]);
  const mockFetchFn = useCallback(createMockFetchFn(MASTER_UNIT_MOCKS), []);
  // const fetchDataFunction = USE_MOCK_DATA && mockFetchFn;
  const fetchDataFunction = realFetchFn;

  const { table, isLoading, refetch } = useServerSideTable<MasterUnitsItemsModel>({
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
      const newGroup = await showUnitsModal({ mode: 'create', size: 'lg:max-w-3xl lg:min-w-[700px]' });
      refetch();
    } catch (error) {
      console.info('การสร้างถูกยกเลิก');
    }
  };

  const handleEdit = async (item: MasterUnitsItemsModel) => {
    try {
      // เรียกใช้โหมด 'edit' พร้อมส่งข้อมูลเริ่มต้น
      const updatedGroup = await showUnitsModal({
        mode: 'edit',
        id: item.id,
        size: 'lg:max-w-3xl lg:min-w-[700px]'
      });
      refetch();
    } catch (error) {
      console.info('การแก้ไขถูกยกเลิก');
    }
  };

  const handleView = (item: MasterUnitsItemsModel) => {
    // โหมด View ไม่จำเป็นต้อง await เพราะเรามักจะไม่สนใจผลลัพธ์
    showUnitsModal({ mode: 'view', id: item.id, size: 'lg:max-w-3xl lg:min-w-[700px]' });
  };


  const handleDelete = async (item: MasterUnitsItemsModel) => {
    try {
      // 2. เรียกใช้ฟังก์ชัน showDeleteConfirm และ "await" ผลลัพธ์
      // ส่งชื่อของ item เข้าไปเพื่อให้ข้อความดูเป็นมิตร
      const result = await showDeleteConfirm(item.nameThai);

      // 3. ตรวจสอบผลลัพธ์ที่ได้กลับมา
      // `result.isConfirmed` จะเป็น true ถ้าผู้ใช้กดปุ่ม "ยืนยัน" (ใช่, ลบเลย)
      if (result.isConfirmed) {
        const result = await unitsService.delete(item.id);
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
            {t('master.unList')} {/* หรือชื่อหัวตาราง */}
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
                        className="w-auto w-100 p-4 align-top border whitespace-nowrap"
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

export default MasterUnitsList;