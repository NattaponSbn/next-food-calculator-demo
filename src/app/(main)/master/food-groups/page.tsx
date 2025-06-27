import React from "react";
import { Metadata } from "next";
import MasterFoodGroupsList from "@/app/components/master/food-groups/list";

export const metadata: Metadata = {
  title: "Food Groups List",
};

// Use an implicit return for conciseness
const MasterFoodGroupsListPage = () => <MasterFoodGroupsList />;

export default MasterFoodGroupsListPage;
