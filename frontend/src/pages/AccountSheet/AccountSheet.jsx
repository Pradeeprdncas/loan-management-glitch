import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';

function AccountSheet() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  
  // Calculate financial data
  const totalLoanAmount = state.loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPayments = state.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = totalLoanAmount - totalPayments;
  
  // Mock expenses and other financial data
  const accountData = {
    assets: {
      cash: 150000,
      bankBalance: 2500000,
      loansReceivable: totalOutstanding,
      fixedAssets: 500000,
      otherAssets: 75000
    },
    liabilities: {
      investorFunds: state.investors.reduce((sum, inv) => sum + inv.amount, 0),
      pendingPayments: 45000,
      operatingExpenses: 125000,
      otherLiabilities: 25000
    },
    income: {
      interestIncome: 185000,
      processingFees: 35000,
      otherIncome: 15000
    },
    expenses: {
      operatingCosts: 95000,
      staffSalaries: 180000,
      investorReturns: 75000,
      otherExpenses: 25000
    }
  };

  const totalAssets = Object.values(accountData.assets).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = Object.values(accountData.liabilities).reduce((sum, val) => sum + val, 0);
  const totalIncome = Object.values(accountData.income).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(accountData.expenses).reduce((sum, val) => sum + val, 0);
  const netProfit = totalIncome - totalExpenses;

  // Account Sheet Items
  const balanceSheetData = [
    // Assets
    { category: 'Assets', item: 'Cash in Hand', amount: accountData.assets.cash, type: 'asset' },
    { category: 'Assets', item: 'Bank Balance', amount: accountData.assets.bankBalance, type: 'asset' },
    { category: 'Assets', item: 'Loans Receivable', amount: accountData.assets.loansReceivable, type: 'asset' },
    { category: 'Assets', item: 'Fixed Assets', amount: accountData.assets.fixedAssets, type: 'asset' },
    { category: 'Assets', item: 'Other Assets', amount: accountData.assets.otherAssets, type: 'asset' },
    // Liabilities
    { category: 'Liabilities', item: 'Investor Funds', amount: accountData.liabilities.investorFunds, type: 'liability' },
    { category: 'Liabilities', item: 'Pending Payments', amount: accountData.liabilities.pendingPayments, type: 'liability' },
    { category: 'Liabilities', item: 'Operating Expenses Payable', amount: accountData.liabilities.operatingExpenses, type: 'liability' },
    { category: 'Liabilities', item: 'Other Liabilities', amount: accountData.liabilities.otherLiabilities, type: 'liability' }
  ];

  const profitLossData = [
    // Income
    { category: 'Income', item: 'Interest Income', amount: accountData.income.interestIncome, type: 'income' },
    { category: 'Income', item: 'Processing Fees', amount: accountData.income.processingFees, type: 'income' },
    { category: 'Income', item: 'Other Income', amount: accountData.income.otherIncome, type: 'income' },
    // Expenses
    { category: 'Expenses', item: 'Operating Costs', amount: accountData.expenses.operatingCosts, type: 'expense' },
    { category: 'Expenses', item: 'Staff Salaries', amount: accountData.expenses.staffSalaries, type: 'expense' },
    { category: 'Expenses', item: 'Investor Returns', amount: accountData.expenses.investorReturns, type: 'expense' },
    { category: 'Expenses', item: 'Other Expenses', amount: accountData.expenses.otherExpenses, type: 'expense' }
  ];

  const balanceSheetColumns = [
    { key: 'category', header: 'Category' },
    { key: 'item', header: 'Account Item' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value, row) => (
        <span className={`font-medium ${
          row.type === 'asset' ? 'text-green-600' : 'text-red-600'
        }`}>
          ₹{value?.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'asset' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];

  const profitLossColumns = [
    { key: 'category', header: 'Category' },
    { key: 'item', header: 'Account Item' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value, row) => (
        <span className={`font-medium ${
          row.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          ₹{value?.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];

  const balanceSheetContent = (
    <div>
      <div className="mb-6">
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="current-month">Current Month</option>
          <option value="last-month">Last Month</option>
          <option value="current-quarter">Current Quarter</option>
          <option value="last-quarter">Last Quarter</option>
          <option value="current-year">Current Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(totalAssets / 100000).toFixed(1)}L
              </p>
              <p className="text-green-700">Total Assets</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-900">
                ₹{(totalLiabilities / 100000).toFixed(1)}L
              </p>
              <p className="text-red-700">Total Liabilities</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">
                ₹{((totalAssets - totalLiabilities) / 100000).toFixed(1)}L
              </p>
              <p className="text-blue-700">Net Worth</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Balance Sheet Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-green-600">Assets</h4>
              <div className="space-y-2">
                {Object.entries(accountData.assets).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-green-600">₹{value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total Assets:</span>
                  <span className="text-green-600">₹{totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-red-600">Liabilities</h4>
              <div className="space-y-2">
                {Object.entries(accountData.liabilities).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-red-600">₹{value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total Liabilities:</span>
                  <span className="text-red-600">₹{totalLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={balanceSheetColumns} data={balanceSheetData} />
    </div>
  );

  const profitLossContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(totalIncome / 1000).toFixed(0)}K
              </p>
              <p className="text-green-700">Total Income</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-900">
                ₹{(totalExpenses / 1000).toFixed(0)}K
              </p>
              <p className="text-red-700">Total Expenses</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ₹{Math.abs(netProfit / 1000).toFixed(0)}K
              </p>
              <p className="text-blue-700">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Profit & Loss Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-green-600">Income</h4>
              <div className="space-y-2">
                {Object.entries(accountData.income).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-green-600">₹{value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total Income:</span>
                  <span className="text-green-600">₹{totalIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-red-600">Expenses</h4>
              <div className="space-y-2">
                {Object.entries(accountData.expenses).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-red-600">₹{value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total Expenses:</span>
                  <span className="text-red-600">₹{totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Net Result</p>
                <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netProfit >= 0 ? 'Profit: ' : 'Loss: '}₹{Math.abs(netProfit).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={profitLossColumns} data={profitLossData} />
    </div>
  );

  const tabs = [
    { label: 'Balance Sheet', content: balanceSheetContent },
    { label: 'Profit & Loss', content: profitLossContent }
  ];

  return (
    <div>
      <PageHeader 
        title="A/C Sheet" 
        subtitle="Comprehensive accounting sheet with balance sheet and profit & loss statements"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default AccountSheet;