import CalculatorBMRHistoryListPage from "@/app/components/calculator-bmr/history/list";
import { Metadata } from "next";

type CalculatorBMRHistoryProps = {}

export const metadata: Metadata = {
  title: 'Calculator BMR History List',
};

const CalculatorBMRHistory = ({}: CalculatorBMRHistoryProps) => {
  return (
    <CalculatorBMRHistoryListPage />
  )
}

export default CalculatorBMRHistory;
