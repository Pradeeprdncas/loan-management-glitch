import { useEffect, useState } from 'react';
import { Check, X, Clock, Eye } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';

function CustomerApproval() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await axios.post(`http://localhost:3000/api/customers/${id}/approve`);
    await fetchCustomers();
  };

  const handleReject = async (id) => {
    await axios.post(`http://localhost:3000/api/customers/${id}/reject`);
    await fetchCustomers();
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'code', header: 'Customer Code' },
    { key: 'name', header: 'Customer Name' },
    { key: 'phone', header: 'Phone Number' },
    { key: 'email', header: 'Email Address' },
    { key: 'level', header: 'Entry Level' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    { key: 'joinDate', header: 'Application Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-1 text-green-600 hover:text-green-800"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  const pendingCustomers = customers.filter(c => c.status === 'pending');
  const waitingCustomers = customers.filter(c => c.status === 'waiting');
  const allCustomers = customers;

  const approvalContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingCustomers.length}</p>
              <p className="text-yellow-700">Pending Approvals</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{waitingCustomers.length}</p>
              <p className="text-blue-700">Waiting List</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                {customers.filter(c => c.status === 'approved').length}
              </p>
              <p className="text-green-700">Approved</p>
            </div>
          </div>
        </div>
      </div>
      <Table columns={columns} data={pendingCustomers} />
    </div>
  );

  const viewEditContent = (
    <div>
      <p className="text-gray-600 mb-4">View and manage all customer applications and their current status.</p>
      <Table columns={columns} data={allCustomers} />
    </div>
  );

  const tabs = [
    { label: 'Pending Approvals', content: approvalContent },
    { label: 'View/Edit All', content: viewEditContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Customer Approval & Waiting Levels" 
        subtitle="Review and approve customer applications"
      />
      
      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Code</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entry Level</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Date</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.joinDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                  {selectedCustomer.status}
                </span>
              </div>
            </div>
            
            {selectedCustomer.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleReject(selectedCustomer.id);
                    setShowDetailsModal(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedCustomer.id);
                    setShowDetailsModal(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CustomerApproval;