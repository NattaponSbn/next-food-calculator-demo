import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   'node_modules/flowbite-react/lib/esm/**/*.js', 
    // Flowbite content
    flowbite.content(),
  ],
  theme: {
    extend: {
      boxShadow: {
        md: "0px 2px 4px -1px rgba(175, 182, 201, 0.2)",
        lg: "0 1rem 3rem rgba(0, 0, 0, 0.175)",
        "dark-md":
          "rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px",
        sm: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
        "btn-shadow": "box-shadow: rgba(0, 0, 0, .05) 0 9px 17.5px",
        "active": "0px 17px 20px -8px rgba(77,91,236,0.231372549)",
      },
      borderRadius: {
        sm: "7px",
        md: "9px",
        lg: "24px",
        tw: "12px",
        page: "20px",
      },
       screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',    // (16px) Padding สำหรับมือถือ (sm)
          md: '2rem',     // (32px) Padding สำหรับ Tablet (md)
          lg: '4rem',     // (64px) Padding สำหรับ Desktop (lg)
          xl: '5rem',     // (80px) Padding สำหรับจอใหญ่ (xl)
          '2xl': '6rem',    // (96px) Padding สำหรับจอใหญ่มาก (2xl)
        }
      },
      gap: {
        "30": "30px",
      },
      padding: {
        "30": "30px",
      },
      margin: {
        "30": "30px",
      },

      colors: {
        cyan: {
          "500": "var(--color-primary)",
          "600": "var(--color-primary)",
          "700": "var(--color-primary)",
        },
        primary: {
          '100': 'var(--color-primary-100)',
          '200': 'var(--color-primary-200)',
          '300': 'var(--color-primary-300)',
          '400': 'var(--color-primary-400)',
          '500': 'var(--color-primary-500)',
          '600': 'var(--color-primary-600)',
          '700': 'var(--color-primary-700)',
          '800': 'var(--color-primary-800)',
          '900': 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary)',
        },
        secondary: "var(--color-secondary)",
        info: "var(--color-info)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        lightprimary: "var(--color-lightprimary)",
        lightsecondary: "var(--color-lightsecondary)",
        lightsuccess: "var( --color-lightsuccess)",
        lighterror: "var(--color-lighterror)",
        lightinfo: "var(--color-lightinfo)",
        lightwarning: "var(--color-lightwarning)",
        border: "var(--color-border)",
        bordergray: "var(--color-bordergray)",
        lightgray: "var( --color-lightgray)",
        muted: "var(--color-muted)",
        dark: "var(--color-dark)",
        link: "var(--color-link)",
        darklink: "var(--color-darklink)",
        ld: "var(--color-ld)",
        darkgray: 'var(--color-background-dark)',
      },
    },
  },
  plugins: [

    require("flowbite/plugin"),
  ],
};
export default config;