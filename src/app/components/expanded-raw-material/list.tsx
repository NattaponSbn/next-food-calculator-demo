"use client";

import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';
import { Column, ColumnDef, flexRender } from '@tanstack/react-table';
import { Table } from 'flowbite-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableStatusRow } from '../shared/table-status-row';
import { ERMColumnNutrientFieldGroupModel, ERMNutritionItemsModel, ERMNutritionRequestModel } from '@/app/core/models/expanded-raw-material/expanded-raw-material.mode';
import { FilterControl } from '../shared/filterable-header';
import { ApiSearchRequest } from '@/app/core/models/shared/page.model';
import { ingredientService } from '@/app/core/services/master/ingredient.service';
import { TablePagination } from '../shared/table-pagination';

const handleOpenFilter = async (
  event: React.MouseEvent<HTMLButtonElement>,
  column: Column<any, any> // รับ column instance เข้ามา
) => {
  const filterType = column.columnDef.meta?.filterType;
};


const ExpandedRawMaterialList = () => {
  const { t } = useTranslation();
  const [isStructureLoading, setIsStructureLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnDef<ERMNutritionItemsModel>[]>([]);

  const buildColumns = useCallback((apiGroups: ERMColumnNutrientFieldGroupModel[]): ColumnDef<ERMNutritionItemsModel>[] => {
    const staticColumns: ColumnDef<ERMNutritionItemsModel>[] = [
      {
        accessorKey: 'foodId',
        header: ({ column }) => (
          <FilterControl
            column={column}
            title={t('Food ID')}
            placeholder={t('Food ID')}
            meta={{ filterType: 'text' }}
            onFilterIconClick={handleOpenFilter}
          />
        ),
        size: 100,
      },
      {
        header: 'Food and Description',
        columns: [
          {
            accessorKey: 'name',
            header: ({ column }) => (
              <FilterControl
                column={column}
                title={t('Thai')}
                placeholder={t('Thai')}
                meta={{ filterType: 'text' }}
                onFilterIconClick={handleOpenFilter}
              />
            ),
            size: 280,
            cell: (info) => (
             <span className='text-start block text-wrap'>{info.getValue<string>()}</span>
            ),
          },
          {
            accessorKey: 'nameEN',
            header: ({ column }) => (
              <FilterControl
                column={column}
                title={t('English')}
                placeholder={t('English')}
                meta={{ filterType: 'text' }}
                onFilterIconClick={handleOpenFilter}
              />
            ),
            size: 280,
             cell: (info) => (
             <span className='text-start block text-wrap'>{info.getValue<string>()}</span>
            ),
          },
        ],
      },
    ];

    const dynamicColumns = apiGroups.map(group => ({
      header: group.name,
      columns: group.nutritions.map(nutrition => ({
        id: nutrition.code,
        header: () => (
          <>
            <div className='text-center mb-1'>
              <span>{nutrition.name}</span>
            </div>
            <div className='text-center'>
              <span className='font-normal'>({nutrition.unitName})</span>
            </div>
          </>


        ),
        size: 110,
        accessorFn: (row: any) => row.nutritions.find((n: any) => n.nutritionId === nutrition.id)?.value ?? '-',
      })),
    }));

    return [...staticColumns, ...dynamicColumns];
  }, [t, handleOpenFilter]); // Dependency คือสิ่งที่ buildColumns ใช้จากภายนอก


  useEffect(() => {
    const fetchTableStructure = async () => {
      try {
        console.log("Phase 1: Fetching table structure...");
        setIsStructureLoading(true);

        // --- นี่คือส่วนที่เรียก API จริง ---
        // `structureService.getHeaderGroups()` คือฟังก์ชันที่ยิง API ตัวแรก
        const headerDataResponse = await ingredientService.getInitialField();

        // สร้าง columns แบบไดนามิกจากข้อมูลที่ได้จาก API
        const generatedColumns = buildColumns(headerDataResponse.nutrientFieldGroups);

        // อัปเดต State ของ Columns
        setColumns(generatedColumns);

      } catch (error) {
        console.error("Failed to fetch table structure:", error);
        // อาจจะแสดงหน้า Error หรือ Toast แจ้งเตือน
      } finally {
        // ไม่ว่าจะสำเร็จหรือล้มเหลว ให้ปิดสถานะ Loading ของโครงสร้าง
        setIsStructureLoading(false);
        console.log("Phase 1: Finished fetching structure.");
      }
    };

    fetchTableStructure();
  }, [ingredientService, buildColumns]); // Dependency คือ service เพื่อให้แน่ใจว่ามี instance พร้อมใช้งาน


  const realFetchFn = useCallback((request: ApiSearchRequest) => {
    return ingredientService.fullSearch(request);
  }, [ingredientService]);

  const initialCriteria = useMemo(() => new ERMNutritionRequestModel(), []);

  // --- [แก้ไข] Generic Type ของ useServerSideTable ---
  const { table, isLoading, refetch } = useServerSideTable<ERMNutritionItemsModel>({
    fetchDataFn: realFetchFn,
    columns,
    initialPageSize: 10,
    initialCriteria: initialCriteria,
  });

  useEffect(() => {
    if (columns && columns.length > 0) {
      refetch();
    }
  }, [columns, refetch]); // ทำงานเมื่อเงื่อนไขเหล่านี้เปลี่ยน
  return (
    <div className="panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <h2 className="panel-title">
            {t('nutrition.list')} {/* หรือชื่อหัวตาราง */}
          </h2>
        </div>
      </div>

      {/* Panel Body */}
      <div className="panel-body">
        <div className="responsive-table-container">
          <div className="responsive-table-scroll-wrapper">
            <Table className="responsive-table table-separated">
              <thead className="responsive-table-header bg-indigo-100 dark:bg-indigo-700 dark:text-gray-400">
                {/* TanStack Table จะสร้าง Header Group ให้เอง! */}
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan} // colSpan จะถูกคำนวณให้โดยอัตโนมัติ
                        className="p-2 align-middle text-center border font-semibold"
                        style={{ minWidth: header.getSize(), width: header.getSize() }} // ใช้ minWidth เพื่อความยืดหยุ่น
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                          className="w-auto px-6 py-4 font-medium border text-gray-900 whitespace-nowrap dark:text-white align-middle text-center"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <TableStatusRow colSpan={table.getAllLeafColumns().length} status="no-data" />
                )
                }

              </tbody>
            </Table>
          </div>
          <TablePagination table={table} />
        </div>
      </div>

    </div>

  );
};

export default ExpandedRawMaterialList;