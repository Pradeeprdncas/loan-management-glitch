import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Edit, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';

function Investors() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    returnRate: '',
    investmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
    contactPerson: '',
    phone: '',
    email: '',
    bankDetails: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const investorData = {
      ...formData,
      amount: parseInt(formData.amount),
      returnRate: parseFloat(formData.returnRate)
    };
    
    if (editingInvestor) {
      dispatch({
        type: 'UPDATE_INVESTOR',
        payload: { ...investorData, id: editingInvestor.id }
      });
    } else {
      dispatch({
        type: 'ADD_INVESTOR',
        payload: investorData
      });
    }
    
    setShowModal(false);
    setEditingInvestor(null);
    setFormData({
      name: '',
      amount: '',
      returnRate: '',
      investmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      contactPerson: '',
      phone: '',
      email: '',
      bankDetails: '',
      notes: ''
    });
  };

  const handleEdit = (investor) => {
    setEditingInvestor(investor);
    setFormData(investor);
    setShowModal(true);
  };

  const handleViewDetails = (investor) => {
    setSelectedInvestor(investor);
    setShowDetailsModal(true);
  };

  // Calculate returns and additional data
  const investorsWithReturns = state.investors.map(investor => {
    const monthsInvested = Math.floor(
      (new Date() - new Date(investor.investmentDate)) / (1000 * 60 * 60 * 24 * 30)
    );
    const monthlyReturn = (investor.amount * investor.returnRate / 100) / 12;
    const totalReturns = monthlyReturn * monthsInvested;
    const currentValue = investor.amount + totalReturns;
    
    return {
      ...investor,
      monthsInvested,
      monthlyReturn,
      totalReturns,
      currentValue
    };
  });

  const columns = [
    { key: 'name', header: 'Investor Name' },
    { key: 'amount', header: 'Investment Amount', render: (value) => `₹${value?.toLocaleString()}` },
    { key: 'returnRate', header: 'Return Rate', render: (value) => `${value}%` },
    { key: 'monthlyReturn', header: 'Monthly Return', render: (value) => `₹${Math.round(value)?.toLocaleString()}` },
    { key: 'totalReturns', header: 'Total Returns', render: (value) => `₹${Math.round(value)?.toLocaleString()}` },
    { key: 'currentValue', header: 'Current Value', render: (value) => `₹${Math.round(value)?.toLocaleString()}` },
    { key: 'investmentDate', header: 'Investment Date' },
    { key: 'monthsInvested', header: 'Months' },
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
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const totalInvestment = state.investors.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investorsWithReturns.reduce((sum, inv) => sum + inv.totalReturns, 0);
  const averageReturnRate = state.investors.length > 0 
    ? state.investors.reduce((sum, inv) => sum + inv.returnRate, 0) / state.investors.length 
    : 0;

  const managementContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">
                ₹{(totalInvestment / 100000).toFixed(1)}L
              </p>
              <p className="text-blue-700">Total Investment</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                ₹{(totalReturns / 1000).toFixed(0)}K
              </p>
              <p className="text-green-700">Total Returns</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-900">{state.investors.length}</p>
              <p className="text-purple-700">Active Investors</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-900">{averageReturnRate.toFixed(1)}%</p>
              <p className="text-orange-700">Avg Return Rate</p>
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
          <span>Add Investor</span>
        </button>
      </div>
      
      <Table columns={columns} data={investorsWithReturns} />
    </div>
  );

  const portfolioContent = (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Portfolio Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Investment Distribution</h4>
              <div className="space-y-3">
                {investorsWithReturns.map(investor => {
                  const percentage = (investor.amount / totalInvestment) * 100;
                  return (
                    <div key={investor.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{investor.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Return Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Portfolio Value:</span>
                  <span className="font-medium">
                    ₹{Math.round(totalInvestment + totalReturns).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Portfolio Growth:</span>
                  <span className="font-medium text-green-600">
                    {((totalReturns / totalInvestment) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Return Payout:</span>
                  <span className="font-medium">
                    ₹{investorsWithReturns.reduce((sum, inv) => sum + inv.monthlyReturn, 0).toFixed(0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Return Coverage Ratio:</span>
                  <span className="font-medium text-blue-600">2.4x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={columns} data={investorsWithReturns} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: managementContent },
    { label: 'View/Edit Details', content: portfolioContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Investors" 
        subtitle="Manage investor relationships and track investment returns"
      />
      
      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInvestor(null);
          setFormData({
            name: '',
            amount: '',
            returnRate: '',
            investmentDate: new Date().toISOString().split('T')[0],
            status: 'active',
            contactPerson: '',
            phone: '',
            email: '',
            bankDetails: '',
            notes: ''
          });
        }}
        title={editingInvestor ? 'Edit Investor' : 'Add Investor'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Investor Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
              placeholder="Investment Corp A"
            />
            
            <FormField
              label="Investment Amount"
              type="number"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              required
              placeholder="5000000"
            />
            
            <FormField
              label="Return Rate (%)"
              type="number"
              step="0.01"
              value={formData.returnRate}
              onChange={(value) => setFormData({ ...formData, returnRate: value })}
              required
              placeholder="12.5"
            />
            
            <FormField
              label="Investment Date"
              type="date"
              value={formData.investmentDate}
              onChange={(value) => setFormData({ ...formData, investmentDate: value })}
              required
            />
            
            <FormField
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(value) => setFormData({ ...formData, contactPerson: value })}
              placeholder="John Manager"
            />
            
            <FormField
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="9876543210"
            />
            
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="investor@company.com"
            />
            
            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              required
            />
          </div>
          
          <FormField
            label="Bank Details"
            type="textarea"
            value={formData.bankDetails}
            onChange={(value) => setFormData({ ...formData, bankDetails: value })}
            placeholder="Bank account details for return payments..."
          />
          
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(value) => setFormData({ ...formData, notes: value })}
            placeholder="Additional notes about the investor..."
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
              {editingInvestor ? 'Update' : 'Add'} Investor
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedInvestor(null);
        }}
        title="Investor Details"
        size="lg"
      >
        {selectedInvestor && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Investor Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInvestor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                <p className="mt-1 text-sm text-gray-900">₹{selectedInvestor.amount?.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Return Rate</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInvestor.returnRate}% per annum</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Return</label>
                <p className="mt-1 text-sm text-green-600 font-medium">
                  ₹{Math.round((selectedInvestor.amount * selectedInvestor.returnRate / 100) / 12).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInvestor.investmentDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedInvestor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedInvestor.status}
                </span>
              </div>
            </div>
            
            {(selectedInvestor.contactPerson || selectedInvestor.phone || selectedInvestor.email) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedInvestor.contactPerson && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInvestor.contactPerson}</p>
                    </div>
                  )}
                  {selectedInvestor.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInvestor.phone}</p>
                    </div>
                  )}
                  {selectedInvestor.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInvestor.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedInvestor.bankDetails && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Details</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInvestor.bankDetails}</p>
              </div>
            )}
            
            {selectedInvestor.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInvestor.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Investors;