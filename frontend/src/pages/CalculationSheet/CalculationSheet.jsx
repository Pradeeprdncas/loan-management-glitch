import { useState } from 'react';
import { Calculator, Percent, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import FormField from '../../components/UI/FormField';

function CalculationSheet() {
  const { state } = useApp();
  
  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    principal: '',
    rate: '',
    tenure: ''
  });
  
  // Interest Calculator State
  const [interestData, setInterestData] = useState({
    principal: '',
    rate: '',
    time: '',
    compoundFrequency: '1'
  });
  
  // Loan Comparison State
  const [comparisonData, setComparisonData] = useState({
    loan1: { principal: '', rate: '', tenure: '' },
    loan2: { principal: '', rate: '', tenure: '' }
  });

  // ROI Calculator State
  const [roiData, setRoiData] = useState({
    investment: '',
    finalValue: '',
    time: ''
  });

  // EMI Calculation
  const calculateEMI = (p, r, n) => {
    if (!p || !r || !n) return 0;
    const principal = parseFloat(p);
    const monthlyRate = parseFloat(r) / 12 / 100;
    const months = parseInt(n);
    
    if (monthlyRate === 0) return principal / months;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Simple Interest Calculation
  const calculateSimpleInterest = (p, r, t) => {
    if (!p || !r || !t) return 0;
    const principal = parseFloat(p);
    const rate = parseFloat(r);
    const time = parseFloat(t);
    return (principal * rate * time) / 100;
  };

  // Compound Interest Calculation
  const calculateCompoundInterest = (p, r, t, n) => {
    if (!p || !r || !t) return 0;
    const principal = parseFloat(p);
    const rate = parseFloat(r) / 100;
    const time = parseFloat(t);
    const frequency = parseInt(n);
    
    const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
    return Math.round(amount - principal);
  };

  // ROI Calculation
  const calculateROI = (investment, finalValue) => {
    if (!investment || !finalValue) return 0;
    const inv = parseFloat(investment);
    const final = parseFloat(finalValue);
    return ((final - inv) / inv) * 100;
  };

  const emiResult = calculateEMI(emiData.principal, emiData.rate, emiData.tenure);
  const totalEmiAmount = emiResult * parseInt(emiData.tenure || 0);
  const totalEmiInterest = totalEmiAmount - parseFloat(emiData.principal || 0);

  const simpleInterest = calculateSimpleInterest(interestData.principal, interestData.rate, interestData.time);
  const compoundInterest = calculateCompoundInterest(
    interestData.principal, 
    interestData.rate, 
    interestData.time, 
    interestData.compoundFrequency
  );

  const loan1Emi = calculateEMI(comparisonData.loan1.principal, comparisonData.loan1.rate, comparisonData.loan1.tenure);
  const loan2Emi = calculateEMI(comparisonData.loan2.principal, comparisonData.loan2.rate, comparisonData.loan2.tenure);
  
  const roi = calculateROI(roiData.investment, roiData.finalValue);

  const calculatorContent = (
    <div className="space-y-8">
      {/* EMI Calculator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calculator className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">EMI Calculator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            label="Principal Amount (₹)"
            type="number"
            value={emiData.principal}
            onChange={(value) => setEmiData({ ...emiData, principal: value })}
            placeholder="100000"
          />
          <FormField
            label="Interest Rate (% per annum)"
            type="number"
            step="0.01"
            value={emiData.rate}
            onChange={(value) => setEmiData({ ...emiData, rate: value })}
            placeholder="12.5"
          />
          <FormField
            label="Tenure (Months)"
            type="number"
            value={emiData.tenure}
            onChange={(value) => setEmiData({ ...emiData, tenure: value })}
            placeholder="24"
          />
        </div>
        
        {emiData.principal && emiData.rate && emiData.tenure && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-blue-600">₹{emiResult.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEmiAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-2xl font-bold text-red-600">₹{totalEmiInterest.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interest Calculator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Percent className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Interest Calculator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FormField
            label="Principal Amount (₹)"
            type="number"
            value={interestData.principal}
            onChange={(value) => setInterestData({ ...interestData, principal: value })}
            placeholder="100000"
          />
          <FormField
            label="Interest Rate (% per annum)"
            type="number"
            step="0.01"
            value={interestData.rate}
            onChange={(value) => setInterestData({ ...interestData, rate: value })}
            placeholder="12.5"
          />
          <FormField
            label="Time Period (Years)"
            type="number"
            value={interestData.time}
            onChange={(value) => setInterestData({ ...interestData, time: value })}
            placeholder="2"
          />
          <FormField
            label="Compound Frequency"
            type="select"
            value={interestData.compoundFrequency}
            onChange={(value) => setInterestData({ ...interestData, compoundFrequency: value })}
            options={[
              { value: '1', label: 'Annually' },
              { value: '2', label: 'Semi-Annually' },
              { value: '4', label: 'Quarterly' },
              { value: '12', label: 'Monthly' }
            ]}
          />
        </div>
        
        {interestData.principal && interestData.rate && interestData.time && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Simple Interest</p>
              <p className="text-2xl font-bold text-green-600">₹{simpleInterest.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                Total: ₹{(parseFloat(interestData.principal) + simpleInterest).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Compound Interest</p>
              <p className="text-2xl font-bold text-purple-600">₹{compoundInterest.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                Total: ₹{(parseFloat(interestData.principal) + compoundInterest).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loan Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="h-6 w-6 text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Loan Comparison</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Loan Option 1</h4>
            <div className="space-y-3">
              <FormField
                label="Principal (₹)"
                type="number"
                value={comparisonData.loan1.principal}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan1: { ...comparisonData.loan1, principal: value }
                })}
                placeholder="100000"
              />
              <FormField
                label="Interest Rate (%)"
                type="number"
                step="0.01"
                value={comparisonData.loan1.rate}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan1: { ...comparisonData.loan1, rate: value }
                })}
                placeholder="12.5"
              />
              <FormField
                label="Tenure (Months)"
                type="number"
                value={comparisonData.loan1.tenure}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan1: { ...comparisonData.loan1, tenure: value }
                })}
                placeholder="24"
              />
            </div>
            
            {loan1Emi > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-xl font-bold text-blue-600">₹{loan1Emi.toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Loan Option 2</h4>
            <div className="space-y-3">
              <FormField
                label="Principal (₹)"
                type="number"
                value={comparisonData.loan2.principal}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan2: { ...comparisonData.loan2, principal: value }
                })}
                placeholder="100000"
              />
              <FormField
                label="Interest Rate (%)"
                type="number"
                step="0.01"
                value={comparisonData.loan2.rate}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan2: { ...comparisonData.loan2, rate: value }
                })}
                placeholder="10.5"
              />
              <FormField
                label="Tenure (Months)"
                type="number"
                value={comparisonData.loan2.tenure}
                onChange={(value) => setComparisonData({
                  ...comparisonData,
                  loan2: { ...comparisonData.loan2, tenure: value }
                })}
                placeholder="24"
              />
            </div>
            
            {loan2Emi > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-xl font-bold text-green-600">₹{loan2Emi.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
        
        {loan1Emi > 0 && loan2Emi > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Comparison Result</h4>
            <div className="text-center">
              {loan1Emi < loan2Emi ? (
                <p className="text-green-600 font-medium">
                  Loan Option 1 has lower EMI by ₹{(loan2Emi - loan1Emi).toLocaleString()} per month
                </p>
              ) : loan2Emi < loan1Emi ? (
                <p className="text-green-600 font-medium">
                  Loan Option 2 has lower EMI by ₹{(loan1Emi - loan2Emi).toLocaleString()} per month
                </p>
              ) : (
                <p className="text-blue-600 font-medium">Both loan options have the same EMI amount</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ROI Calculator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">ROI Calculator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            label="Initial Investment (₹)"
            type="number"
            value={roiData.investment}
            onChange={(value) => setRoiData({ ...roiData, investment: value })}
            placeholder="100000"
          />
          <FormField
            label="Final Value (₹)"
            type="number"
            value={roiData.finalValue}
            onChange={(value) => setRoiData({ ...roiData, finalValue: value })}
            placeholder="125000"
          />
          <FormField
            label="Time Period (Years)"
            type="number"
            value={roiData.time}
            onChange={(value) => setRoiData({ ...roiData, time: value })}
            placeholder="2"
          />
        </div>
        
        {roiData.investment && roiData.finalValue && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Return on Investment</p>
              <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Profit/Loss</p>
              <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(parseFloat(roiData.finalValue || 0) - parseFloat(roiData.investment || 0)).toLocaleString()}
              </p>
            </div>
            {roiData.time && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Annualized ROI</p>
                <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(roi / parseFloat(roiData.time)).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const businessContent = (
    <div className="space-y-6">
      {/* Business Metrics from Current Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Business Calculations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Portfolio</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{(state.loans.reduce((sum, loan) => sum + loan.amount, 0) / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Collections</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{(state.payments.reduce((sum, payment) => sum + payment.amount, 0) / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-yellow-600">
              ₹{((state.loans.reduce((sum, loan) => sum + loan.amount, 0) - 
                  state.payments.reduce((sum, payment) => sum + payment.amount, 0)) / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Avg Loan Size</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{state.loans.length > 0 
                ? Math.round(state.loans.reduce((sum, loan) => sum + loan.amount, 0) / state.loans.length).toLocaleString()
                : '0'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Collection Efficiency */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Collection Efficiency Analysis</h3>
        
        <div className="space-y-4">
          {state.loans.map(loan => {
            const loanPayments = state.payments.filter(p => p.loanId === loan.id);
            const totalPaid = loanPayments.reduce((sum, p) => sum + p.amount, 0);
            const collectionRate = (totalPaid / loan.amount) * 100;
            
            return (
              <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                
                <div>
                  <p className="font-medium text-gray-900">{loan.loanNumber}</p>
                  <p className="text-sm text-gray-600">{loan.customerName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">₹{totalPaid.toLocaleString()} / ₹{loan.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{collectionRate.toFixed(1)}% collected</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        collectionRate >= 100 ? 'bg-green-500' :
                        collectionRate >= 75 ? 'bg-blue-500' :
                        collectionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(collectionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: 'Financial Calculators', content: calculatorContent },
    { label: 'Business Analysis', content: businessContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Calculation Sheet" 
        subtitle="Financial calculators and business analysis tools"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default CalculationSheet;