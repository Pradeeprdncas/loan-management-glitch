import { useState } from 'react';
import { Calendar, TrendingUp, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';

function OverallReportEMI() {
  const { state } = useApp();
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter EMI loans
  const emiLoans = state.loans.filter(loan => loan.type === 'EMI');
  
  // Calculate loan history with payment tracking
  const loanHistory = emiLoans.map(loan => {
    const payments = state.payments.filter(p => p.loanId === loan.id);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = loan.amount - totalPaid;
    const paymentCount = payments.length;
    
    return {
      ...loan,
      totalPaid,
      remainingAmount,
      paymentCount,
      lastPayment: payments.length > 0 ? payments[payments.length - 1].paymentDate : null
    };
  });

  const columns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'amount', header: 'Loan Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'totalPaid', header: 'Amount Paid', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'remainingAmount', header: 'Remaining', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'interestRate', header: 'Interest Rate', render: (value) => `${value}%` },
    { key: 'tenure', header: 'Tenure (Months)' },
    { key: 'paymentCount', header: 'Payments Made' },
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

  const summaryStats = {
    totalLoans: emiLoans.length,
    totalAmount: emiLoans.reduce((sum, loan) => sum + loan.amount, 0),
    totalCollected: loanHistory.reduce((sum, loan) => sum + loan.totalPaid, 0),
    totalOutstanding: loanHistory.reduce((sum, loan) => sum + loan.remainingAmount, 0),
    completedLoans: loanHistory.filter(loan => loan.remainingAmount <= 0).length,
    activeLoans: loanHistory.filter(loan => loan.remainingAmount > 0).length
  };

  const reportContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{summaryStats.totalLoans}</p>
              <p className="text-blue-700">Total EMI Loans</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(summaryStats.totalCollected / 100000).toFixed(1)}L
              </p>
              <p className="text-green-700">Total Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">
                ₹{(summaryStats.totalOutstanding / 100000).toFixed(1)}L
              </p>
              <p className="text-yellow-700">Outstanding Amount</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{(summaryStats.totalAmount / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-600">Total Disbursed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {((summaryStats.totalCollected / summaryStats.totalAmount) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Collection Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{summaryStats.completedLoans}</p>
            <p className="text-sm text-gray-600">Completed Loans</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{summaryStats.activeLoans}</p>
            <p className="text-sm text-gray-600">Active Loans</p>
          </div>
        </div>
      </div>
      
      <Table columns={columns} data={loanHistory} />
    </div>
  );

  const analysisContent = (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">EMI Performance Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Payment Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-time Payments</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Late Payments</span>
                <span className="font-medium text-yellow-600">6%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Missed Payments</span>
                <span className="font-medium text-red-600">2%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Loan Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">12 Month Loans</span>
                <span className="font-medium text-blue-600">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">24 Month Loans</span>
                <span className="font-medium text-blue-600">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">36+ Month Loans</span>
                <span className="font-medium text-blue-600">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={columns} data={loanHistory} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: reportContent },
    { label: 'View/Edit Details', content: analysisContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Overall Report - EMI" 
        subtitle="Comprehensive EMI loan performance and history tracking"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default OverallReportEMI;