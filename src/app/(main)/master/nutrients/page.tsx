import React from "react";
import { Metadata } from "next";
import MasterNutrientList from "@/app/components/master/nutrients/list";

export const metadata: Metadata = {
  title: "Nutrient List",
};

// Use an implicit return for conciseness
const MasterNutrientListPage = () => <MasterNutrientList />;

export default MasterNutrientListPage;
