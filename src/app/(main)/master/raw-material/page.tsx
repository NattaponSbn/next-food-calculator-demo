import React from "react";
import MasterRawMaterialList from "@/app/components/master/raw-material/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Raw Material List",
};

// Use an implicit return for conciseness
const MasterRawMaterialListPage = () => <MasterRawMaterialList />;

export default MasterRawMaterialListPage;
