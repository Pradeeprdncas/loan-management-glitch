import { useState } from 'react';
import { Plus, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';

function LoanEntry() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    type: 'EMI', // EMI (N) or Normal (O)
    interestRate: '',
    tenure: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const customer = state.customers.find(c => c.id === parseInt(formData.customerId));
    const loanNumber = `LN${String(Date.now()).slice(-6)}`;
    
    const loanData = {
      ...formData,
      loanNumber,
      customerName: customer?.name || 'Unknown',
      amount: parseInt(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      tenure: parseInt(formData.tenure),
      status: 'active',
      nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    };
    
    dispatch({ type: 'ADD_LOAN', payload: loanData });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { message: `Loan ${loanNumber} created successfully`, type: 'success' }
    });
    
    setShowModal(false);
    setFormData({
      customerId: '',
      amount: '',
      type: 'EMI',
      interestRate: '',
      tenure: '',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                 (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const columns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'amount', header: 'Loan Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { 
      key: 'type', 
      header: 'Loan Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'EMI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value} {value === 'EMI' ? '(N)' : '(O)'}
        </span>
      )
    },
    { key: 'interestRate', header: 'Interest Rate', render: (value) => `${value}%` },
    { key: 'tenure', header: 'Tenure (Months)' },
    {
      key: 'emi',
      header: 'EMI Amount',
      render: (_, row) => {
        if (row.type === 'EMI') {
          const emi = calculateEMI(row.amount, row.interestRate, row.tenure);
          return `₹${emi.toLocaleString()}`;
        }
        return 'Interest Only';
      }
    },
    { key: 'startDate', header: 'Start Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const entryContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">
                ₹{(state.loans.reduce((sum, loan) => sum + loan.amount, 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-blue-700">Total Loans Disbursed</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                {state.loans.filter(loan => loan.status === 'active').length}
              </p>
              <p className="text-green-700">Active Loans</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Loan</span>
        </button>
      </div>
      <Table columns={columns} data={state.loans} />
    </div>
  );

  const viewEditContent = (
    <div>
      <p className="text-gray-600 mb-4">View and manage all loans in the system.</p>
      <Table columns={columns} data={state.loans} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: entryContent },
    { label: 'View/Edit Details', content: viewEditContent }
  ];

  const approvedCustomers = state.customers.filter(c => c.status === 'approved');

  return (
    <div>
      <PageHeader 
        title="Loan Entry" 
        subtitle="Create and manage loan entries with EMI and Normal loan types"
      />
      
      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Loan"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Customer"
              type="select"
              value={formData.customerId}
              onChange={(value) => setFormData({ ...formData, customerId: value })}
              options={approvedCustomers.map(customer => ({
                value: customer.id,
                label: `${customer.name} (${customer.code})`
              }))}
              required
            />
            
            <FormField
              label="Loan Amount"
              type="number"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              required
              placeholder="100000"
            />
            
            <FormField
              label="Loan Type"
              type="select"
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              options={[
                { value: 'EMI', label: 'EMI (N) - Equal Monthly Installments' },
                { value: 'Normal', label: 'Normal (O) - Interest Only' }
              ]}
              required
            />
            
            <FormField
              label="Interest Rate (%)"
              type="number"
              step="0.01"
              value={formData.interestRate}
              onChange={(value) => setFormData({ ...formData, interestRate: value })}
              required
              placeholder="12.5"
            />
            
            <FormField
              label="Tenure (Months)"
              type="number"
              value={formData.tenure}
              onChange={(value) => setFormData({ ...formData, tenure: value })}
              required
              placeholder="24"
            />
            
            <FormField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(value) => setFormData({ ...formData, startDate: value })}
              required
            />
          </div>
          
          {formData.amount && formData.interestRate && formData.tenure && formData.type === 'EMI' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">EMI Calculation</h4>
              <p className="text-blue-800">
                Monthly EMI: ₹{calculateEMI(
                  parseInt(formData.amount) || 0,
                  parseFloat(formData.interestRate) || 0,
                  parseInt(formData.tenure) || 0
                ).toLocaleString()}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Loan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LoanEntry;