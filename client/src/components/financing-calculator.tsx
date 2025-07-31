import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";

interface FinancingCalculatorProps {
  vehiclePrice?: number;
  className?: string;
}

export default function FinancingCalculator({ vehiclePrice = 0, className }: FinancingCalculatorProps) {
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(4.9);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculatePayment = () => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      return;
    }

    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPaid = payment * numPayments;
    const interest = totalPaid - principal;

    setMonthlyPayment(payment);
    setTotalInterest(interest);
  };

  const downPaymentPercentage = price > 0 ? (downPayment / price) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Financing Calculator
        </CardTitle>
        <CardDescription>
          Calculate your estimated monthly payment and see how different terms affect your loan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Vehicle Price
          </Label>
          <Input
            id="price"
            type="number"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            placeholder="Enter vehicle price"
            className="text-lg"
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Down Payment: ${downPayment.toLocaleString()} ({downPaymentPercentage.toFixed(1)}%)
          </Label>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            max={price * 0.5}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>${(price * 0.5).toLocaleString()}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate: {interestRate}% APR
          </Label>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={1}
            max={30}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="term" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Term
          </Label>
          <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="36">36 months (3 years)</SelectItem>
              <SelectItem value="48">48 months (4 years)</SelectItem>
              <SelectItem value="60">60 months (5 years)</SelectItem>
              <SelectItem value="72">72 months (6 years)</SelectItem>
              <SelectItem value="84">84 months (7 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculatePayment} className="w-full" size="lg">
          Calculate Payment
        </Button>

        {/* Results */}
        {monthlyPayment !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-blue-900">Payment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  ${monthlyPayment.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Monthly Payment</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  ${totalInterest?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Interest</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 text-center mt-3">
              <p>Loan Amount: ${(price - downPayment).toLocaleString()}</p>
              <p>Total Amount Paid: ${((monthlyPayment * loanTerm) + downPayment).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>* This calculator provides estimates only. Actual rates and terms may vary based on credit approval and other factors.</p>
        </div>
      </CardContent>
    </Card>
  );
}