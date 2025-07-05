import React from "react";
import { Metadata } from "next";
import ExpandedRawMaterialList from "@/app/components/expanded-raw-material/list";

export const metadata: Metadata = {
  title: "Expanded Raw Material",
};

// Use an implicit return for conciseness
const ExpandedRawMaterialPage = () => <ExpandedRawMaterialList />;

export default ExpandedRawMaterialPage;
