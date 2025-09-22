import { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';

function PaymentReceived() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const loan = state.loans.find(l => l.id === parseInt(formData.loanId));
    
    const paymentData = {
      ...formData,
      loanNumber: loan?.loanNumber || 'Unknown',
      customerName: loan?.customerName || 'Unknown',
      amount: parseInt(formData.amount),
      status: 'received'
    };
    
    dispatch({ type: 'ADD_PAYMENT', payload: paymentData });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { message: `Payment received for ${loan?.loanNumber}`, type: 'success' }
    });
    
    setShowModal(false);
    setFormData({
      loanId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'Bank Transfer',
      notes: ''
    });
  };

  const handleStatusUpdate = (paymentId, newStatus) => {
    const payment = state.payments.find(p => p.id === paymentId);
    dispatch({
      type: 'UPDATE_PAYMENT',
      payload: { ...payment, status: newStatus }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'loanNumber', header: 'Loan Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'amount', header: 'Payment Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'paymentDate', header: 'Payment Date' },
    { key: 'method', header: 'Payment Method' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(row.id, 'received')}
                className="p-1 text-green-600 hover:text-green-800"
                title="Mark as Received"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleStatusUpdate(row.id, 'failed')}
                className="p-1 text-red-600 hover:text-red-800"
                title="Mark as Failed"
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  const todaysPayments = state.payments.filter(p => 
    p.paymentDate === new Date().toISOString().split('T')[0]
  );
  
  const receivedPayments = state.payments.filter(p => p.status === 'received');
  const pendingPayments = state.payments.filter(p => p.status === 'pending');

  const entryContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(receivedPayments.reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-green-700">Payments Received</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingPayments.length}</p>
              <p className="text-yellow-700">Pending Payments</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{todaysPayments.length}</p>
              <p className="text-blue-700">Today's Payments</p>
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
          <span>Record Payment</span>
        </button>
      </div>
      <Table columns={columns} data={state.payments} />
    </div>
  );

  const viewEditContent = (
    <div>
      <p className="text-gray-600 mb-4">View payment history and manage payment statuses.</p>
      <Table columns={columns} data={state.payments} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: entryContent },
    { label: 'View/Edit Details', content: viewEditContent }
  ];

  const activeLoans = state.loans.filter(l => l.status === 'active');

  return (
    <div>
      <PageHeader 
        title="Payment Received" 
        subtitle="Record and track loan payment receipts and status"
      />
      
      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Record Payment"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Loan"
              type="select"
              value={formData.loanId}
              onChange={(value) => setFormData({ ...formData, loanId: value })}
              options={activeLoans.map(loan => ({
                value: loan.id,
                label: `${loan.loanNumber} - ${loan.customerName}`
              }))}
              required
            />
            
            <FormField
              label="Payment Amount"
              type="number"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              required
              placeholder="5000"
            />
            
            <FormField
              label="Payment Date"
              type="date"
              value={formData.paymentDate}
              onChange={(value) => setFormData({ ...formData, paymentDate: value })}
              required
            />
            
            <FormField
              label="Payment Method"
              type="select"
              value={formData.method}
              onChange={(value) => setFormData({ ...formData, method: value })}
              options={[
                { value: 'Bank Transfer', label: 'Bank Transfer' },
                { value: 'Cash', label: 'Cash' },
                { value: 'Cheque', label: 'Cheque' },
                { value: 'Online', label: 'Online Payment' },
                { value: 'UPI', label: 'UPI' }
              ]}
              required
            />
          </div>
          
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(value) => setFormData({ ...formData, notes: value })}
            placeholder="Additional notes about the payment..."
          />
          
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
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentReceived;