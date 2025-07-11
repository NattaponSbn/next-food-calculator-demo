import CalculatorRawMaterialPage from "@/app/components/calculator/cal-raw-material";
import { Metadata } from "next";

type CalculatorRawMaterialHistoryManageProps = {}

export const metadata: Metadata = {
  title: 'Calculator History Manage',
};

const CalculatorRawMaterialHistoryManage = ({}: CalculatorRawMaterialHistoryManageProps) => {
  return (
    <CalculatorRawMaterialPage />
  )
}

export default CalculatorRawMaterialHistoryManage;
