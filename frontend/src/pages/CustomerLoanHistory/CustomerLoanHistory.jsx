import { useState } from 'react';
import { Search, FileText, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import FormField from '../../components/UI/FormField';

function CustomerLoanHistory() {
  const { state } = useApp();
  const [customerCode, setCustomerCode] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Find customer and their loan history
  const customer = customerCode 
    ? state.customers.find(c => 
        c.code.toLowerCase().includes(customerCode.toLowerCase()) ||
        c.name.toLowerCase().includes(customerCode.toLowerCase())
      )
    : null;

  const customerLoans = customer 
    ? state.loans.filter(loan => loan.customerId === customer.id)
    : [];

  const customerPayments = customer 
    ? state.payments.filter(payment => 
        customerLoans.some(loan => loan.id === payment.loanId)
      )
    : [];

  // Calculate holding amounts and totals
  const loanHistory = customerLoans.map(loan => {
    const loanPayments = state.payments.filter(p => p.loanId === loan.id);
    const totalPaid = loanPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = loan.amount - totalPaid;
    const lastPayment = loanPayments.length > 0 
      ? loanPayments[loanPayments.length - 1].paymentDate 
      : null;
    
    return {
      ...loan,
      totalPaid,
      remainingAmount,
      lastPayment,
      paymentCount: loanPayments.length
    };
  });

  const loanColumns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'amount', header: 'Original Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'totalPaid', header: 'Amount Paid', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'remainingAmount', header: 'Outstanding', render: (value) => `₹${value?.toLocaleString()}` },
    { 
      key: 'type', 
      header: 'Loan Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'EMI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'interestRate', header: 'Interest Rate', render: (value) => `${value}%` },
    { key: 'startDate', header: 'Start Date' },
    { key: 'lastPayment', header: 'Last Payment' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value, row) => {
        let statusClass = 'bg-gray-100 text-gray-800';
        let statusText = value;
        
        if (row.remainingAmount <= 0) {
          statusClass = 'bg-green-100 text-green-800';
          statusText = 'Completed';
        } else if (value === 'active') {
          statusClass = 'bg-blue-100 text-blue-800';
          statusText = 'Active';
        }
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
            {statusText}
          </span>
        );
      }
    }
  ];

  const paymentColumns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'amount', header: 'Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'paymentDate', header: 'Payment Date' },
    { key: 'method', header: 'Payment Method' },
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
    }
  ];

  const customerSummary = customer && loanHistory.length > 0 ? {
    totalLoans: loanHistory.length,
    totalBorrowed: loanHistory.reduce((sum, loan) => sum + loan.amount, 0),
    totalPaid: loanHistory.reduce((sum, loan) => sum + loan.totalPaid, 0),
    totalOutstanding: loanHistory.reduce((sum, loan) => sum + loan.remainingAmount, 0),
    activeLoans: loanHistory.filter(loan => loan.remainingAmount > 0).length,
    completedLoans: loanHistory.filter(loan => loan.remainingAmount <= 0).length
  } : null;

  const historyContent = (
    <div>
      <div className="mb-6">
        <FormField
          label="Customer Code"
          value={customerCode}
          onChange={setCustomerCode}
          placeholder="Enter customer code or name..."
        />
      </div>
      
      {customer ? (
        <div>
          {/* Customer Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                customer.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {customer.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Customer Code</p>
                <p className="text-gray-900">{customer.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-gray-900">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                <p className="text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Entry Level</p>
                <p className="text-gray-900">{customer.level}</p>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          {customerSummary && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-blue-900">{customerSummary.totalLoans}</p>
                <p className="text-blue-700 text-xs">Total Loans</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-purple-900">
                  ₹{(customerSummary.totalBorrowed / 100000).toFixed(1)}L
                </p>
                <p className="text-purple-700 text-xs">Total Borrowed</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-green-900">
                  ₹{(customerSummary.totalPaid / 100000).toFixed(1)}L
                </p>
                <p className="text-green-700 text-xs">Total Paid</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-900">
                  ₹{(customerSummary.totalOutstanding / 1000).toFixed(0)}K
                </p>
                <p className="text-red-700 text-xs">Outstanding</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <Calendar className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-yellow-900">{customerSummary.activeLoans}</p>
                <p className="text-yellow-700 text-xs">Active Loans</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900">{customerSummary.completedLoans}</p>
                <p className="text-gray-700 text-xs">Completed</p>
              </div>
            </div>
          )}

          {/* Loan History Table */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loan History & Holdings</h3>
            <Table columns={loanColumns} data={loanHistory} />
          </div>

          {/* Payment History Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
            <Table columns={paymentColumns} data={customerPayments} />
          </div>
        </div>
      ) : customerCode ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Not Found</h3>
          <p className="text-gray-600">
            No customer found with code or name: "{customerCode}"
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Customer</h3>
          <p className="text-gray-600">
            Enter a customer code or name to view their loan history and holdings
          </p>
        </div>
      )}
    </div>
  );

  const summaryContent = (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Customers Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.customers.map(customer => {
            const custLoans = state.loans.filter(loan => loan.customerId === customer.id);
            const custPayments = state.payments.filter(payment => 
              custLoans.some(loan => loan.id === payment.loanId)
            );
            const totalBorrowed = custLoans.reduce((sum, loan) => sum + loan.amount, 0);
            const totalPaid = custPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const outstanding = totalBorrowed - totalPaid;
            
            return (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{customer.name}</h4>
                  <span className="text-sm text-gray-600">{customer.code}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Loans:</span>
                    <span className="font-medium">{custLoans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Borrowed:</span>
                    <span className="font-medium">₹{totalBorrowed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outstanding:</span>
                    <span className={`font-medium ${outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{outstanding.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCustomerCode(customer.code)}
                  className="mt-3 w-full text-sm bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: historyContent },
    { label: 'View/Edit Details', content: summaryContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Customer Loan History & Holding" 
        subtitle="View comprehensive loan history and current holdings for customers"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default CustomerLoanHistory;