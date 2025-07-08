import CalculatorRawMaterialPage from "@/app/components/calculator/cal-raw-material";
import { Metadata } from "next";

type CalculatorManageProps = {}

export const metadata: Metadata = {
  title: 'Calculator',
};

const CalculatorManage = ({}: CalculatorManageProps) => {
  return (
    <CalculatorRawMaterialPage />
  )
}

export default CalculatorManage;
