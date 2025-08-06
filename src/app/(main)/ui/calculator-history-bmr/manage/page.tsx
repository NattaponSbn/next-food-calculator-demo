import CalculatorBMRPage from "@/app/components/calculator-bmr/cal-bmr";
import { Metadata } from "next";

type CalculatorBMRHistoryManageProps = {}

export const metadata: Metadata = {
  title: 'Calculator BMR History Manage',
};

const CalculatorBMRHistoryManage = ({}: CalculatorBMRHistoryManageProps) => {
  return (
    <CalculatorBMRPage />
  )
}

export default CalculatorBMRHistoryManage;
