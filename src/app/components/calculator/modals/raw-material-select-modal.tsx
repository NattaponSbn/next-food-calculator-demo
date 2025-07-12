'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Checkbox, Label, Table, TextInput } from 'flowbite-react';
import { type InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { ModalFrame, ModalSize } from '../../shared/modals/modal-frame';
import { useTranslation } from 'react-i18next';
import { Column, ColumnDef, ColumnFiltersState, flexRender, PaginationState, SortingState } from '@tanstack/react-table';
import { FilterControl } from '../../shared/filterable-header';
import { TablePagination } from '../../shared/table-pagination';
import { TableStatusRow } from '../../shared/table-status-row';
import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';
import { ApiSearchRequest } from '@/app/core/models/shared/page.model';
import { ingredientService } from '@/app/core/services/master/ingredient.service';
import { MasterRawMaterialItemsModel, MasterRawMaterialRequestModel } from '@/app/core/models/master/raw-material/raw-material.model';


export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
export interface RawMaterialSelectProps {
    mode: Mode;
    id?: number;
    size?: ModalSize;
}

export const RawMaterialSelectModal = ({
    mode,
    id,
    size,
    onConfirm,
    onClose
}: RawMaterialSelectProps & InjectedModalProps<MasterRawMaterialItemsModel[]>) => {
    const { t } = useTranslation();
    const isViewMode = mode === 'view';
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [persistedSelectedRows, setPersistedSelectedRows] = useState<Record<string, MasterRawMaterialItemsModel>>({});

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


    // --- Column Definitions with Filter Controls ---
    const columns = useMemo<ColumnDef<MasterRawMaterialItemsModel>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    // ป้องกันการ re-render ที่ไม่จำเป็น
                    onClick={(e) => e.stopPropagation()}
                />
            ),
            size: 60,
        },
        {
            accessorKey: 'foodId', // สมมติว่ามีฟีลด์นี้
            header: ({ column }) => (
                <FilterControl
                    column={column}
                    title={t('master.rmFoodId')}
                    placeholder={t('master.rmFoodId')}
                    meta={{ filterType: 'text' }}
                    onFilterIconClick={handleOpenFilter}
                />
            ),
            size: 90,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <FilterControl
                    column={column}
                    title={`${t('master.rmName')} (${t('system.language.th')})`}
                    placeholder={`${t('master.rmName')} (${t('system.language.th')})`}
                    meta={{ filterType: 'text' }}
                    onFilterIconClick={handleOpenFilter}
                />
            ),
            size: 250,
            cell: (info) => (
                <span className='text-start block text-wrap'>{info.getValue<string>()}</span>
            ),
        },
        {
            accessorKey: 'nameEN',
            header: ({ column }) => (
                <FilterControl
                    column={column}
                    title={`${t('master.rmName')} (${t('system.language.en')})`}
                    placeholder={`${t('master.rmName')} (${t('system.language.en')})`}
                    meta={{ filterType: 'text' }}
                    onFilterIconClick={handleOpenFilter}
                />
            ),
            size: 250,
            cell: (info) => (
                <span className='text-start block text-wrap'>{info.getValue<string>()}</span>
            ),
        },
    ], []);

      const initialCriteria = useMemo(() => new MasterRawMaterialRequestModel(), []);

    // --- Data Fetching Logic ---
    const realFetchFn = useCallback((request: ApiSearchRequest) => {
        return ingredientService.search(request);
    }, [ingredientService]);
    // const realFetchFn = ...

    const { table, refetch } = useServerSideTable<MasterRawMaterialItemsModel>({
        fetchDataFn: realFetchFn, // ในอนาคตเปลี่ยนเป็น API จริง
        columns,
        initialPageSize: 10,
        initialCriteria: initialCriteria,
        // ส่ง Options สำหรับ Row Selection เข้าไป
        tanstackTableOptions: {
           state: { 
                // รวม State ทั้งหมดที่ตารางต้องใช้
                rowSelection, 
                sorting, 
                columnFilters, 
                pagination 
            },
            // ส่ง Handler ทั้งหมดเข้าไปด้วย
            onRowSelectionChange: setRowSelection,
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onPaginationChange: setPagination,

            enableRowSelection: true,
            enableMultiRowSelection: true,

            getRowId: (row) => String(row.id),
        },
    });

    // --- Initial Data Load ---
     useEffect(() => {
            refetch();
        }, [refetch]);

          // ✅ 2. ใช้ useEffect เพื่อ "สะสม" ข้อมูลเมื่อการเลือกในหน้าปัจจุบันเปลี่ยน
  useEffect(() => {
    // ดึงข้อมูลของแถวที่ถูก "เลือก" ในหน้าปัจจุบัน
    const currentPageSelectedRows = table.getSelectedRowModel().flatRows.reduce((acc, row) => {
      acc[row.id] = row.original;
      return acc;
    }, {} as Record<string, MasterRawMaterialItemsModel>);
    
    // ดึงข้อมูลของแถวที่ "ไม่ได้ถูกเลือก" ในหน้าปัจจุบัน
    const currentPageUnselectedRowIds = table.getCoreRowModel().flatRows
      .filter(row => !row.getIsSelected())
      .map(row => row.id);

    setPersistedSelectedRows(prev => {
      const newPersisted = { ...prev };
      
      // ลบข้อมูลของแถวที่ถูก "uncheck" ในหน้าปัจจุบันออกจากที่สะสมไว้
      currentPageUnselectedRowIds.forEach(id => {
        delete newPersisted[id];
      });
      
      // เพิ่ม/อัปเดตข้อมูลของแถวที่ถูก "check" ในหน้าปัจจุบันเข้าไป
      return { ...newPersisted, ...currentPageSelectedRows };
    });

  }, [rowSelection, table.getCoreRowModel, table.getSelectedRowModel]);

    const handleConfirm = () => {
         const allSelectedItems = Object.values(persistedSelectedRows);
        onConfirm(allSelectedItems);
    };

    return (
        <ModalFrame
            title={t('calculator.selectIngredients')}
            size={size}
            footer={
                <>
                    <Button color="gray" onClick={() => { onClose({ isCancellation: !isViewMode }); }} >
                        {t('button.close')}
                    </Button>
                    <Button color="success" form="food-group-form" onClick={handleConfirm}>
                        {t('button.saveData')}
                    </Button>
                </>
            }
        >
            <div className="responsive-table-container">
                <div className="responsive-table-scroll-wrapper"> {/* สามารถ custom style={{ '--table-max-height': '500px' } as React.CSSProperties} */}
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
        </ModalFrame>
    );
};