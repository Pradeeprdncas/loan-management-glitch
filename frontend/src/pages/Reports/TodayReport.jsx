import { useState } from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import FormField from '../../components/UI/FormField';

function TodayReport() {
  const { state } = useApp();
  const [staffCode, setStaffCode] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's activities
  const todaysLoans = state.loans.filter(loan => loan.startDate === selectedDate);
  const todaysPayments = state.payments.filter(payment => payment.paymentDate === selectedDate);
  
  // Staff performance data (mock calculation)
  const staffPerformance = state.staff.map(member => {
    const memberLoans = todaysLoans.filter(() => Math.random() > 0.7); // Mock assignment
    const memberPayments = todaysPayments.filter(() => Math.random() > 0.8); // Mock assignment
    
    return {
      ...member,
      loansProcessed: memberLoans.length,
      paymentsCollected: memberPayments.reduce((sum, p) => sum + p.amount, 0),
      customersContacted: Math.floor(Math.random() * 20) + 5 // Mock data
    };
  });

  const loanColumns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'amount', header: 'Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { 
      key: 'type', 
      header: 'Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'EMI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value} {value === 'EMI' ? '(N)' : '(O)'}
        </span>
      )
    },
    { key: 'interestRate', header: 'Rate', render: (value) => `${value}%` },
    { key: 'startDate', header: 'Date' }
  ];

  const paymentColumns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'amount', header: 'Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'method', header: 'Method' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'paymentDate', header: 'Date' }
  ];

  const staffColumns = [
    { key: 'code', header: 'Staff Code' },
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'loansProcessed', header: 'Loans Processed' },
    { key: 'paymentsCollected', header: 'Payments Collected', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'customersContacted', header: 'Customers Contacted' }
  ];

  // Filter by staff code if provided
  const filteredStaffPerformance = staffCode 
    ? staffPerformance.filter(member => 
        member.code.toLowerCase().includes(staffCode.toLowerCase())
      )
    : staffPerformance;

  const summaryStats = {
    totalLoans: todaysLoans.length,
    totalLoanAmount: todaysLoans.reduce((sum, loan) => sum + loan.amount, 0),
    totalPayments: todaysPayments.length,
    totalPaymentAmount: todaysPayments.reduce((sum, payment) => sum + payment.amount, 0),
    emiLoans: todaysLoans.filter(loan => loan.type === 'EMI').length,
    normalLoans: todaysLoans.filter(loan => loan.type === 'Normal').length
  };

  const reportContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        
        <FormField
          label="Staff Code (DSR)"
          value={staffCode}
          onChange={setStaffCode}
          placeholder="Enter staff code to filter..."
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-900">{summaryStats.totalLoans}</p>
          <p className="text-blue-700 text-sm">Total Loans</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-900">{summaryStats.totalPayments}</p>
          <p className="text-green-700 text-sm">Payments</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-900">{summaryStats.emiLoans}</p>
          <p className="text-purple-700 text-sm">EMI Loans</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-900">{summaryStats.normalLoans}</p>
          <p className="text-orange-700 text-sm">Normal Loans</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Loans ({selectedDate})</h3>
          <Table columns={loanColumns} data={todaysLoans} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Payments ({selectedDate})</h3>
          <Table columns={paymentColumns} data={todaysPayments} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Performance Report</h3>
          <Table columns={staffColumns} data={filteredStaffPerformance} />
        </div>
      </div>
    </div>
  );

  const analysisContent = (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Loan Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Loan Amount:</span>
                  <span className="font-medium">₹{summaryStats.totalLoanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Loan Size:</span>
                  <span className="font-medium">
                    ₹{summaryStats.totalLoans > 0 
                      ? Math.round(summaryStats.totalLoanAmount / summaryStats.totalLoans).toLocaleString()
                      : '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">EMI vs Normal Ratio:</span>
                  <span className="font-medium">
                    {summaryStats.emiLoans}:{summaryStats.normalLoans}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Payment Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Collections:</span>
                  <span className="font-medium">₹{summaryStats.totalPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Payment:</span>
                  <span className="font-medium">
                    ₹{summaryStats.totalPayments > 0 
                      ? Math.round(summaryStats.totalPaymentAmount / summaryStats.totalPayments).toLocaleString()
                      : '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Collection Efficiency:</span>
                  <span className="font-medium text-green-600">
                    {summaryStats.totalLoanAmount > 0 
                      ? ((summaryStats.totalPaymentAmount / summaryStats.totalLoanAmount) * 100).toFixed(1)
                      : '0'
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">EMI Loans Detail</h3>
          <Table 
            columns={loanColumns} 
            data={todaysLoans.filter(loan => loan.type === 'EMI')} 
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Normal Loans Detail</h3>
          <Table 
            columns={loanColumns} 
            data={todaysLoans.filter(loan => loan.type === 'Normal')} 
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: reportContent },
    { label: 'View/Edit Details', content: analysisContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Today Report - EMI & Normal" 
        subtitle="Daily activity report for EMI and Normal loan transactions"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default TodayReport;