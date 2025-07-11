import CalculatorRawMaterialHistoryListPage from "@/app/components/calculator/history/list";
import { Metadata } from "next";

type CalculatorRawMaterialHistoryProps = {}

export const metadata: Metadata = {
  title: 'Calculator History List',
};

const CalculatorRawMaterialHistory = ({}: CalculatorRawMaterialHistoryProps) => {
  return (
    <CalculatorRawMaterialHistoryListPage />
  )
}

export default CalculatorRawMaterialHistory;
