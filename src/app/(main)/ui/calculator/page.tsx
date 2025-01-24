import CalculatorManageComponent from "@/app/components/calculator/calculator";
import { Metadata } from "next";

type CalculatorManageProps = {}

export const metadata: Metadata = {
  title: 'Calculator',
};

const CalculatorManage = ({}: CalculatorManageProps) => {
  return (
    <CalculatorManageComponent />
  )
}

export default CalculatorManage;
