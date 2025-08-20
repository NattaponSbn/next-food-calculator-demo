import React from "react";
import { Metadata } from "next";
import MasterActivitysList from "@/app/components/master/activity/list";

export const metadata: Metadata = {
  title: "Activity List",
};

// Use an implicit return for conciseness
const MasteactivitysListPage = () => <MasterActivitysList />;

export default MasteactivitysListPage;
