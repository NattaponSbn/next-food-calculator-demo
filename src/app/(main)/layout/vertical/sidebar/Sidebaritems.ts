export interface ChildItem {
  id?: number | string;
  nameKey?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  headingKey: string;
  nameKey?: string; // ถ้ามีเมนูแบบไม่มี heading
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
   // --- กลุ่มข้อมูลโภชนาการ (ตารางใหญ่) ---
  {
    headingKey: "menu.headings.raw_material_nutrition_facts",
    children: [
      {
        nameKey: "menu.items.nutrition_data_table",
        icon: "solar:database-bold-duotone", // ไอคอนฐานข้อมูล, เหมาะกับตารางข้อมูลใหญ่
        id: uniqueId(),
        url: "/ui/expanded-raw-material",
      },
    ],
  },
  
  // --- กลุ่มคำนวณสูตรอาหาร ---
  {
    headingKey: "menu.headings.diet_calculation",
    children: [
      {
        nameKey: "menu.items.calculator_formula",
        icon: "solar:calculator-bold-duotone", // ไอคอนเครื่องคิดเลขตรงตัว
        id: uniqueId(),
        url: "/ui/calculator",
      },
      {
        nameKey: "menu.items.calculator_history",
        icon: "solar:history-bold-duotone", // ไอคอนประวัติศาสตร์, นาฬิกาย้อนกลับ
        id: uniqueId(),
        url: "/ui/calculator-history",
      },
    ],
  },
  
  // --- กลุ่มข้อมูลหลัก (Master Data) ---
  // {
  //   headingKey: "menu.headings.master",
  //   children: [
  //     {
  //       nameKey: "menu.items.food_groups",
  //       icon: "solar:widget-5-bold-duotone", // ไอคอนกลุ่ม, category
  //       id: uniqueId(),
  //       url: "/master/food-groups",
  //     },
  //     {
  //       nameKey: "menu.items.nutrient_categories",
  //       icon: "solar:checklist-minimalistic-bold-duotone", // ไอคอนหมวดหมู่, checklist
  //       id: uniqueId(),
  //       url: "/master/nutrient-categories",
  //     },
  //     {
  //       nameKey: "menu.items.nutrients",
  //       icon: "solar:dna-bold-duotone", // ไอคอน DNA, เหมาะกับสารอาหาร
  //       id: uniqueId(),
  //       url: "/master/nutrients",
  //     },
  //     {
  //       nameKey: "menu.items.units",
  //       icon: "solar:ruler-pen-bold-duotone", // ไอคอนไม้บรรทัด, การวัด
  //       id: uniqueId(),
  //       url: "/master/units",
  //     },
  //     {
  //       nameKey: "menu.items.raw_material",
  //       icon: "solar:box-minimalistic-bold-duotone", // ไอคอนกล่อง, วัตถุดิบ
  //       id: uniqueId(),
  //       url: "/master/raw-material",
  //     },
  //   ],
  // },
];

export default SidebarContent;
