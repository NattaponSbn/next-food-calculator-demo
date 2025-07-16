"use client";
import React from "react";
import Image from "next/image";
import Logo from "/public/images/logos/solar-calculator-linear-logo.svg";
import Logowhite from "/public/images/logos/solar-calculator-linear-logo.svg";
import Link from "next/link";
const FullLogo = () => {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-2">
        <div>
          {/* Dark Logo   */}
        <Image src={Logo} alt="logo" className="block dark:hidden rtl:scale-x-[-1] w-9" />
        {/* Light Logo  */}
        <Image src={Logowhite} alt="logo" className="hidden dark:block rtl:scale-x-[-1] w-9" />
        </div>
        <h1 className="text-xl">NutriTachy</h1>
      </div>
    </Link>
  );
};

export default FullLogo;
