import React from "react";
import { Metadata } from "next";
import MasterNutrientCategoriesList from "@/app/components/master/nutrient-categories/list";

export const metadata: Metadata = {
  title: "Nutrient Categories List",
};

// Use an implicit return for conciseness
const MasterNutrientCategoriesListPage = () => <MasterNutrientCategoriesList />;

export default MasterNutrientCategoriesListPage;
