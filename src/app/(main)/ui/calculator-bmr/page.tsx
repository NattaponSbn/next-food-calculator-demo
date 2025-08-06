import CalculatorBMRPage from "@/app/components/calculator-bmr/cal-bmr";
import CalculatorRawMaterialPage from "@/app/components/calculator/cal-raw-material";
import { Metadata } from "next";

type CalculatorBMRManageProps = {}

export const metadata: Metadata = {
  title: 'Calculator BMR',
};

const CalculatorBMRManage = ({}: CalculatorBMRManageProps) => {
  return (
    <CalculatorBMRPage />
  )
}

export default CalculatorBMRManage;
