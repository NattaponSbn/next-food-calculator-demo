'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Checkbox, Label, Table, TextInput } from 'flowbite-react';
import { type InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { ModalFrame, ModalSize } from '../../shared/modals/modal-frame';
import { useTranslation } from 'react-i18next';
import { Column, ColumnDef, flexRender } from '@tanstack/react-table';
import { FilterControl } from '../../shared/filterable-header';
import { TablePagination } from '../../shared/table-pagination';
import { TableStatusRow } from '../../shared/table-status-row';
import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';

// --- Mock Data & Models (ในอนาคตจะมาจาก API) ---
interface MasterRawMaterialItem {
    rawMaterialObjectId: string;
    nameThai: string;
    nameEng: string;
    baseUnit: string;
}

const MOCK_RAW_MATERIALS: MasterRawMaterialItem[] = [
    { rawMaterialObjectId: 'raw_001', nameThai: 'อกไก่ (ไม่ติดหนัง)', nameEng: 'Chicken Breast', baseUnit: 'g' },
    { rawMaterialObjectId: 'raw_002', nameThai: 'ข้าวกล้องหอมมะลิ', nameEng: 'Brown Rice', baseUnit: 'g' },
    { rawMaterialObjectId: 'raw_003', nameThai: 'บรอกโคลี', nameEng: 'Broccoli', baseUnit: 'g' },
    { rawMaterialObjectId: 'raw_004', nameThai: 'น้ำมันมะกอก', nameEng: 'Olive Oil', baseUnit: 'ml' },
    { rawMaterialObjectId: 'raw_005', nameThai: 'ไข่ไก่', nameEng: 'Egg', baseUnit: 'ฟอง' },
];

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
}: RawMaterialSelectProps & InjectedModalProps<MasterRawMaterialItem[]>) => {
    const { t } = useTranslation();
    const isViewMode = mode === 'view';
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [rowSelection, setRowSelection] = useState({});

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
    const columns = useMemo<ColumnDef<MasterRawMaterialItem>[]>(() => [
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
                    title={t('Food Id')}
                    placeholder={t('Food Id')}
                    meta={{ filterType: 'text' }}
                    onFilterIconClick={handleOpenFilter}
                />
            ),
            size: 120,
        },
        {
            accessorKey: 'nameThai',
            header: ({ column }) => (
                <FilterControl
                    column={column}
                    title={t('Thai')}
                    placeholder={t('Thai')}
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
            accessorKey: 'nameEng',
            header: ({ column }) => (
                <FilterControl
                    column={column}
                    title={t('English')}
                    placeholder={t('English')}
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

    // --- Data Fetching Logic ---
    const mockFetchFn = useCallback(createMockFetchFn(MOCK_RAW_MATERIALS), []);
    // const realFetchFn = ...

    const { table, refetch } = useServerSideTable<MasterRawMaterialItem>({
        fetchDataFn: mockFetchFn, // ในอนาคตเปลี่ยนเป็น API จริง
        columns,
        initialPageSize: 5,
        // ส่ง Options สำหรับ Row Selection เข้าไป
        tanstackTableOptions: {
            state: { rowSelection },
            enableRowSelection: true,
            onRowSelectionChange: setRowSelection,
            // ทำให้สามารถเลือกแถวได้โดยการคลิกที่ไหนก็ได้ในแถว (Optional)
            enableMultiRowSelection: true,
        },
    });

    // --- Initial Data Load ---
    useEffect(() => {
        refetch();
    }, [refetch]);


    const handleConfirm = () => {
        const selectedItems = table.getSelectedRowModel().flatRows.map(row => row.original);
        onConfirm(selectedItems);
    };

    return (
        <ModalFrame
            title={t('เลือกวัถุดิบ')}
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