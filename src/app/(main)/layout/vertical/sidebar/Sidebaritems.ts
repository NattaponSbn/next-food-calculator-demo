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
  {
    headingKey: "menu.headings.diet_calculation",
    children: [
      {
        nameKey: "menu.items.calculator_formula",
        icon: "solar:archive-broken",
        id: uniqueId(),
        url: "/ui/calculator",
      },
    ],
  },
  {
    headingKey: "menu.headings.master",
    children: [
      {
        nameKey: "menu.items.food_groups",
        icon: "solar:archive-broken",
        id: uniqueId(),
        url: "/master/food-groups",
      },
      {
        nameKey: "menu.items.nutrient_categories",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/master/nutrient-categories",
      },
      {
        nameKey: "menu.items.nutrients",
        icon: "solar:dna-outline",
        id: uniqueId(),
        url: "/master/nutrients",
      },
      {
        nameKey: "menu.items.units",
        icon: "solar:ruler-pen-outline",
        id: uniqueId(),
        url: "/master/units",
      },
      {
        nameKey: "menu.items.raw_material",
        icon: "solar:archive-broken",
        id: uniqueId(),
        url: "/master/raw-material",
      },
      {
        nameKey: "menu.items.formula",
        icon: "solar:archive-broken",
        id: uniqueId(),
        url: "/master/formula",
      },
    ],
  },
  // {
  //   heading: "HOME",
  //   children: [
  //     {
  //       name: "Dashboard",
  //       icon: "solar:widget-add-line-duotone",
  //       id: uniqueId(),
  //       url: "/dashboard",
  //     },
  //   ],
  // },
  // {
  //   heading: "UTILITIES",
  //   children: [
  //     {
  //       name: "Typography",
  //       icon: "solar:text-circle-outline",
  //       id: uniqueId(),
  //       url: "/ui/typography",
  //     },
  //     {
  //       name: "Table",
  //       icon: "solar:bedside-table-3-linear",
  //       id: uniqueId(),
  //       url: "/ui/table",
  //     },
  //     {
  //       name: "Form",
  //       icon: "solar:password-minimalistic-outline",
  //       id: uniqueId(),
  //       url: "/ui/form",
  //     },
  //     {
  //       name: "Shadow",
  //       icon: "solar:airbuds-case-charge-outline",
  //       id: uniqueId(),
  //       url: "/ui/shadow",
  //     },
  //   ],
  // },
  // {
  //   heading: "AUTH",
  //   children: [
  //     {
  //       name: "Login",
  //       icon: "solar:login-2-linear",
  //       id: uniqueId(),
  //       url: "/auth/login",
  //     },
  //     {
  //       name: "Register",
  //       icon: "solar:shield-user-outline",
  //       id: uniqueId(),
  //       url: "/auth/register",
  //     },
  //   ],
  // },
  // {
  //   heading: "EXTRA",
  //   children: [
  //     {
  //       name: "Icons",
  //       icon: "solar:smile-circle-outline",
  //       id: uniqueId(),
  //       url: "/icons/solar",
  //     },
  //     {
  //       name: "Sample Page",
  //       icon: "solar:notes-minimalistic-outline",
  //       id: uniqueId(),
  //       url: "/sample-page",
  //     },
  //   ],
  // },
];

export default SidebarContent;
