"use client";

import { useServerSideTable } from '@/app/core/hooks/use-server-side-table';
import { createMockFetchFn } from '@/app/core/services/mock-api-helpers';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import { Table } from 'flowbite-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableStatusRow } from '../shared/table-status-row';
import { ExpandedRawMaterialModel } from '@/app/core/models/expanded-raw-material/expanded-raw-material.mode';

export const EXPANDED_RAW_MATERIAL_MOCKS: ExpandedRawMaterialModel[] = [
  {
    foodId: '01001', nameThai: 'ก๋วยเตี๋ยว, เส้นจันท์, แห้ง', nameEng: 'Noodle, rice, small size strip, dried',
    energyKcal: '(350)', waterG: 12.7, proteinG: 5.30, fatG: 0.30, carbohydrateG: '(81.40)', dietaryFibreG: '(0.6)', ashG: 0.30,
    calciumMg: 29, phosphorusMg: 73, magnesiumMg: null, sodiumMg: null, potassiumMg: null, ironMg: null, copperMg: null, zincMg: null, iodineUg: null,
    betacaroteneUg: 0, retinolUg: 0, totalVitaminARae: 0, thiaminMg: 'tr', riboflavinMg: 'tr', niacinMg: 0.70, vitaminCMg: 0, vitaminEMg: null,
    sugarG: null,
  },
  {
    foodId: '01002', nameThai: 'ก๋วยเตี๋ยว, เส้นเล็ก, เส้นสด', nameEng: 'Noodle, rice, small size strip, fresh',
    energyKcal: '(220)', waterG: 45.7, proteinG: 4.40, fatG: 0.60, carbohydrateG: '(49.20)', dietaryFibreG: '(0.2)', ashG: 0.10,
    calciumMg: 12, phosphorusMg: 22, magnesiumMg: null, sodiumMg: null, potassiumMg: null, ironMg: 1.90, copperMg: null, zincMg: null, iodineUg: null,
    betacaroteneUg: 0, retinolUg: 0, totalVitaminARae: 0, thiaminMg: 0.00, riboflavinMg: 0.01, niacinMg: 0.60, vitaminCMg: null, vitaminEMg: null,
    sugarG: null,
  },
  {
    foodId: '01007', nameThai: 'ข้าวกล้อง, งอก, ดิบ', nameEng: 'Rice, brown, germinated, raw',
    energyKcal: 366, waterG: 10.3, proteinG: 7.57, fatG: 3.73, carbohydrateG: 74.13, dietaryFibreG: 2.9, ashG: 1.44,
    calciumMg: 6, phosphorusMg: null, magnesiumMg: null, sodiumMg: 12, potassiumMg: null, ironMg: null, copperMg: null, zincMg: null, iodineUg: null,
    betacaroteneUg: 0, retinolUg: 0, totalVitaminARae: 0, thiaminMg: 0.21, riboflavinMg: 0.16, niacinMg: 1.40, vitaminCMg: null, vitaminEMg: null,
    sugarG: 0.77,
  },
];


const ExpandedRawMaterialList = () => {
  const { t } = useTranslation();

    const columns = useMemo<ColumnDef<ExpandedRawMaterialModel>[]>(() => {
    // ฟังก์ชันช่วยสร้าง Header ที่มีหน่วย
    const createHeader = (title: string, unit: string) => (
      <div className='text-center'>
        <span>{title}</span>
        <br />
        <span className='font-normal'>({unit})</span>
      </div>
    );

    return [
      // --- Group 1: Food and Description ---
      { 
            accessorKey: 'foodId', 
            header: 'Food ID', 
            size: 100 
        },
      {
        header: 'Food and Description',
        columns: [
          { accessorKey: 'nameThai', header: 'Thai', size: 250 },
          { accessorKey: 'nameEng', header: 'English', size: 250 },
        ],
      },
      // --- Group 2: Main nutrients ---
      {
        header: 'Main nutrients', // 🚩 แถวที่ 1
        columns: [
          {
            header: 'Energy (Energy)', // 🚩 แถวที่ 2
            columns: [
              // นี่คือคอลัมน์สุดท้ายที่จะแสดงข้อมูลจริง
              {
                accessorKey: 'energyKcal',
                header: '(kcal)', // 🚩 แถวที่ 3
                size: 90,
                cell: info => info.getValue() ?? '-'
              }
            ]
          },
          {
            header: 'Water', // 🚩 แถวที่ 2
            columns: [
              // นี่คือคอลัมน์สุดท้ายที่จะแสดงข้อมูลจริง
              {
                accessorKey: 'waterG',
                header: '(g)', // 🚩 แถวที่ 3
                size: 90,
                cell: info => info.getValue() ?? '-'
              }
            ]
          },
          { accessorKey: 'energyKcal', header: () => createHeader('Energy', 'kcal'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'waterG', header: () => createHeader('Water', 'g'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'proteinG', header: () => createHeader('Protein', 'g'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'fatG', header: () => createHeader('Fat', 'g'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'carbohydrateG', header: () => createHeader('Carbohydrate', 'g'), size: 120, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'dietaryFibreG', header: () => createHeader('Dietary fibre', 'g'), size: 120, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'ashG', header: () => createHeader('Ash', 'g'), size: 90, cell: info => info.getValue() ?? '-' },
        ],
      },
      // --- Group 3: Minerals ---
      {
        header: 'Minerals',
        columns: [
          { accessorKey: 'calciumMg', header: () => createHeader('Calcium', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'phosphorusMg', header: () => createHeader('Phosphorus', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'magnesiumMg', header: () => createHeader('Magnesium', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'sodiumMg', header: () => createHeader('Sodium', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'potassiumMg', header: () => createHeader('Potassium', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'ironMg', header: () => createHeader('Iron', 'mg'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'copperMg', header: () => createHeader('Copper', 'mg'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'zincMg', header: () => createHeader('Zinc', 'mg'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'iodineUg', header: () => createHeader('Iodine', 'ug'), size: 90, cell: info => info.getValue() ?? '-' },
        ],
      },
      // --- Group 4: Vitamins ---
      {
        header: 'Vitamins',
        columns: [
          { accessorKey: 'betacaroteneUg', header: () => createHeader('Betacarotene', 'ug'), size: 120, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'retinolUg', header: () => createHeader('Retinol', 'ug'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'totalVitaminARae', header: () => createHeader('Total vitamin A', 'RAE'), size: 130, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'thiaminMg', header: () => createHeader('Thiamin', 'mg'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'riboflavinMg', header: () => createHeader('Riboflavin', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'niacinMg', header: () => createHeader('Niacin', 'mg'), size: 90, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'vitaminCMg', header: () => createHeader('Vitamin C', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
          { accessorKey: 'vitaminEMg', header: () => createHeader('Vitamin E', 'mg'), size: 100, cell: info => info.getValue() ?? '-' },
        ],
      },
      // --- Group 5: Other ---
      {
        header: 'Other',
        columns: [
          { accessorKey: 'sugarG', header: () => createHeader('Sugar', 'g'), size: 90, cell: info => info.getValue() ?? '-' },
        ],
      },
    ];
  }, [t]);

    // --- [แก้ไข] Data Fetching Logic ให้ใช้ Mock ใหม่ ---
  const USE_MOCK_DATA = true; // เปิดโหมด Mock เพื่อทดสอบ
  const mockFetchFn = useCallback(createMockFetchFn(EXPANDED_RAW_MATERIAL_MOCKS), []);
//   const realFetchFn = useCallback((request) => ingredientService.search(request), [ingredientService]);
  const fetchDataFunction = USE_MOCK_DATA && mockFetchFn;
  
  // --- [แก้ไข] Generic Type ของ useServerSideTable ---
  const { table, isLoading, refetch } = useServerSideTable<ExpandedRawMaterialModel>({
    fetchDataFn: fetchDataFunction,
    columns,
    initialPageSize: 15,
  });
  
  return (
    <div className="panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <h2 className="panel-title">
            {t('master.rmList')} {/* หรือชื่อหัวตาราง */}
          </h2>
        </div>
      </div>

      {/* Panel Body */}
      <div className="panel-body">
        <div className="responsive-table-container">
          <div className="responsive-table-scroll-wrapper">
            <Table className="responsive-table min-w-full text-sm">
               <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
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
                          className="px-6 py-4 font-medium border text-gray-900 whitespace-nowrap dark:text-white align-middle"
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
      </div>

    </div>

  );
};

export default ExpandedRawMaterialList;