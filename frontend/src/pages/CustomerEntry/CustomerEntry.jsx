import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Phone, User } from 'lucide-react';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import Alert from '../../components/UI/Alert';

function CustomerEntry() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    customer_code: '',
    full_name: '',
    phone_primary: '',
    phone_secondary: '',
    phone_tertiary: '',
    email: '',
    address: '',
    kyc_details: '',
    bank_account_number: '',
    bank_ifsc_code: '',
    bank_name: '',
    bank_branch: '',
    parent_or_partner_name: '',
    co_applicant_name: '',
    co_applicant_details: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers', error);
      setStatus({ type: 'failure', message: 'Failed to load customers' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCustomer) {
        await axios.put(`http://localhost:3000/api/customers/${editingCustomer.id}`, formData);
        setStatus({ type: 'success', message: 'Customer updated successfully' });
      } else {
        await axios.post('http://localhost:3000/api/customers', formData);
        setStatus({ type: 'success', message: 'Customer added successfully' });
      }
      await fetchCustomers();
      setShowModal(false);
      setEditingCustomer(null);
      resetForm();
    } catch (error) {
      console.error('Error saving customer', error);
      setStatus({ type: 'failure', message: error.response?.data?.error || 'Error saving customer' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_code: '',
      full_name: '',
      phone_primary: '',
      phone_secondary: '',
      phone_tertiary: '',
      email: '',
      address: '',
      kyc_details: '',
      bank_account_number: '',
      bank_ifsc_code: '',
      bank_name: '',
      bank_branch: '',
      parent_or_partner_name: '',
      co_applicant_name: '',
      co_applicant_details: '',
      status: 'pending',
      notes: ''
    });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customer_code: customer.customer_code || '',
      full_name: customer.full_name || '',
      phone_primary: customer.phone_primary || '',
      phone_secondary: customer.phone_secondary || '',
      phone_tertiary: customer.phone_tertiary || '',
      email: customer.email || '',
      address: customer.address || '',
      kyc_details: customer.kyc_details || '',
      bank_account_number: customer.bank_account_number || '',
      bank_ifsc_code: customer.bank_ifsc_code || '',
      bank_name: customer.bank_name || '',
      bank_branch: customer.bank_branch || '',
      parent_or_partner_name: customer.parent_or_partner_name || '',
      co_applicant_name: customer.co_applicant_name || '',
      co_applicant_details: customer.co_applicant_details || '',
      status: customer.status || 'pending',
      notes: customer.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/customers/${id}`);
        setStatus({ type: 'success', message: 'Customer deleted successfully' });
        await fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer', error);
        setStatus({ type: 'failure', message: error.response?.data?.error || 'Error deleting customer' });
      } finally {
        setLoading(false);
      }
    }
  };

  const generateCustomerCode = () => {
    const random = String(Date.now()).slice(-5);
    setFormData(prev => ({ ...prev, customer_code: `CUS${random}` }));
  };

  const columns = [
    { key: 'customer_code', header: 'Customer Code' },
    { key: 'full_name', header: 'Full Name' },
    { key: 'phone_primary', header: 'Phone 1' },
    { key: 'phone_secondary', header: 'Phone 2' },
    { key: 'phone_tertiary', header: 'Phone 3' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row)} className="p-1 text-blue-600 hover:text-blue-800" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:text-red-800" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const entryContent = (
    <div>
      <div className="mb-4 flex justify-between items-center">
        {status && <Alert type={status.type} message={status.message} />}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <Table columns={columns} data={customers} />
    </div>
  );

  const tabs = [
    { label: 'Customer Entry', content: entryContent },
    { label: 'View/Edit All', content: <Table columns={columns} data={customers} /> }
  ];

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Customer Entry"
        subtitle="Add and manage customer details including KYC and bank information"
      />

      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCustomer(null); resetForm(); }}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-2">
              <FormField label="Customer Code" value={formData.customer_code} onChange={(v) => setFormData({ ...formData, customer_code: v })} required placeholder="CUS00001" />
              <button type="button" onClick={generateCustomerCode} className="mt-6 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">Generate</button>
            </div>

            <FormField label="Full Name" value={formData.full_name} onChange={(v) => setFormData({ ...formData, full_name: v })} required placeholder="Customer Name" />

            <FormField label="Phone Number 1" value={formData.phone_primary} onChange={(v) => setFormData({ ...formData, phone_primary: v })} required placeholder="Primary phone" />
            <FormField label="Phone Number 2" value={formData.phone_secondary} onChange={(v) => setFormData({ ...formData, phone_secondary: v })} placeholder="Optional" />
            <FormField label="Phone Number 3" value={formData.phone_tertiary} onChange={(v) => setFormData({ ...formData, phone_tertiary: v })} placeholder="Optional" />

            <FormField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="email@example.com" />
            <FormField label="Status" type="select" value={formData.status} onChange={(v) => setFormData({ ...formData, status: v })} options={[{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]} required />
          </div>

          <FormField label="Address" type="textarea" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} placeholder="Full address" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="KYC Details" type="textarea" value={formData.kyc_details} onChange={(v) => setFormData({ ...formData, kyc_details: v })} placeholder="PAN, Aadhaar, etc." />
            <FormField label="Bank Account Number" value={formData.bank_account_number} onChange={(v) => setFormData({ ...formData, bank_account_number: v })} placeholder="1234567890" />
            <FormField label="IFSC Code" value={formData.bank_ifsc_code} onChange={(v) => setFormData({ ...formData, bank_ifsc_code: v })} placeholder="SBIN000000" />
            <FormField label="Bank Name" value={formData.bank_name} onChange={(v) => setFormData({ ...formData, bank_name: v })} placeholder="Bank" />
            <FormField label="Bank Branch" value={formData.bank_branch} onChange={(v) => setFormData({ ...formData, bank_branch: v })} placeholder="Branch" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Parent/Partner Name" value={formData.parent_or_partner_name} onChange={(v) => setFormData({ ...formData, parent_or_partner_name: v })} placeholder="Guardian or spouse" />
            <FormField label="Co-applicant Name" value={formData.co_applicant_name} onChange={(v) => setFormData({ ...formData, co_applicant_name: v })} placeholder="Optional" />
            <FormField label="Co-applicant Details" type="textarea" value={formData.co_applicant_details} onChange={(v) => setFormData({ ...formData, co_applicant_details: v })} placeholder="Relation, contact, etc." />
          </div>

          <FormField label="Notes" type="textarea" value={formData.notes} onChange={(v) => setFormData({ ...formData, notes: v })} placeholder="Additional information" />

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">{editingCustomer ? 'Update' : 'Add'} Customer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CustomerEntry;


