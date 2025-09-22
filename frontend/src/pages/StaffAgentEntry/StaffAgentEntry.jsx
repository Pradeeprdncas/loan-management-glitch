import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, UserCheck } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import Alert from '../../components/UI/Alert';

function StaffAgentEntry() {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    staff_code: '',
    full_name: '',
    role: 'Agent',
    phone: '',
    email: '',
    address: '',
    salary: '',
    join_date: new Date().toISOString().split('T')[0],
    status: 'active',
    bank_details: '',
    emergency_contact: '',
    kyc_details: '',
    notes: ''
  });

  // Load staff data from API
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStatus({ type: 'failure', message: 'Error loading staff data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const staffData = {
      ...formData,
      salary: formData.salary ? parseFloat(formData.salary) : null
    };
    
    try {
      setLoading(true);
      if (editingStaff) {
        await axios.put(`http://localhost:3000/api/staff/${editingStaff.id}`, staffData);
        setStatus({ type: 'success', message: 'Staff member updated successfully' });
      } else {
        await axios.post('http://localhost:3000/api/staff', staffData);
        setStatus({ type: 'success', message: 'Staff member added successfully' });
      }
      
      await fetchStaff(); // Refresh the list
      setShowModal(false);
      setEditingStaff(null);
      resetForm();
    } catch (error) {
      console.error('Error saving staff:', error);
      setStatus({ type: 'failure', message: error.response?.data?.error || 'Error saving staff member' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      staff_code: '',
      full_name: '',
      role: 'Agent',
      phone: '',
      email: '',
      address: '',
      salary: '',
      join_date: new Date().toISOString().split('T')[0],
      status: 'active',
      bank_details: '',
      emergency_contact: '',
      kyc_details: '',
      notes: ''
    });
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({
      staff_code: staff.staff_code,
      full_name: staff.full_name,
      role: staff.role,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
      salary: staff.salary,
      join_date: staff.join_date,
      status: staff.status,
      bank_details: staff.bank_details,
      emergency_contact: staff.emergency_contact,
      kyc_details: staff.kyc_details,
      notes: staff.notes
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/staff/${id}`);
        setStatus({ type: 'success', message: 'Staff member deleted successfully' });
        await fetchStaff(); // Refresh the list
      } catch (error) {
        console.error('Error deleting staff:', error);
        setStatus({ type: 'failure', message: error.response?.data?.error || 'Error deleting staff member' });
      } finally {
        setLoading(false);
      }
    }
  };

  const generateStaffCode = () => {
    const rolePrefix = formData.role === 'Manager' ? 'STF' : 'AGT';
    const randomNum = String(Date.now()).slice(-3);
    setFormData({ ...formData, staff_code: `${rolePrefix}${randomNum}` });
  };

  const columns = [
    { key: 'staff_code', header: 'Staff Code' },
    { key: 'full_name', header: 'Full Name' },
    { 
      key: 'role', 
      header: 'Role',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'phone', header: 'Phone Number' },
    { key: 'email', header: 'Email' },
    { key: 'salary', header: 'Salary', render: (value) => value ? `₹${value.toLocaleString()}` : 'Not specified' },
    { key: 'join_date', header: 'Join Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
            onClick={() => handleEdit(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const staffStats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.status === 'active').length,
    managers: staff.filter(s => s.role === 'Manager').length,
    agents: staff.filter(s => s.role === 'Agent').length,
    totalSalaryExpense: staff.reduce((sum, s) => sum + (s.salary || 0), 0)
  };

  const entryContent = (
    <div>
      {status && (
        <div className="mb-4">
          <Alert type={status.type} message={status.message} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{staffStats.totalStaff}</p>
              <p className="text-blue-700">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">{staffStats.activeStaff}</p>
              <p className="text-green-700">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-900">{staffStats.managers}</p>
              <p className="text-purple-700">Managers</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-900">{staffStats.agents}</p>
              <p className="text-orange-700">Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">
                ₹{(staffStats.totalSalaryExpense / 1000).toFixed(0)}K
              </p>
              <p className="text-yellow-700">Monthly Expense</p>
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
          <span>Add Staff Member</span>
        </button>
      </div>
      
      <Table columns={columns} data={staff} />
    </div>
  );

  const managementContent = (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Management Overview</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Department Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Management:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(staffStats.managers / staffStats.totalStaff) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-purple-600">{staffStats.managers}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agents:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(staffStats.agents / staffStats.totalStaff) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-blue-600">{staffStats.agents}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Staff Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Employee Retention Rate:</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Tenure:</span>
                  <span className="font-medium text-blue-600">18 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Monthly Salary:</span>
                  <span className="font-medium">
                    ₹{staffStats.totalStaff > 0 ? Math.round(staffStats.totalSalaryExpense / staffStats.totalStaff).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Performance Rating:</span>
                  <span className="font-medium text-yellow-600">4.2/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={columns} data={staff} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: entryContent },
    { label: 'View/Edit Details', content: managementContent }
  ];

  if (loading && staff.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading staff data...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Staff & Agent Entry" 
        subtitle="Manage staff and agent information, roles, and employment details"
      />
      
      <TabContainer tabs={tabs} />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStaff(null);
          resetForm();
        }}
        title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-2">
              <FormField
                label="Staff Code"
                value={formData.staff_code}
                onChange={(value) => setFormData({ ...formData, staff_code: value })}
                required
                placeholder="STF001 or AGT001"
              />
              <button
                type="button"
                onClick={generateStaffCode}
                className="mt-6 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                Generate
              </button>
            </div>
            
            <FormField
              label="Full Name"
              value={formData.full_name}
              onChange={(value) => setFormData({ ...formData, full_name: value })}
              required
              placeholder="John Manager"
            />
            
            <FormField
              label="Role"
              type="select"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={[
                { value: 'Manager', label: 'Manager' },
                { value: 'Agent', label: 'Agent' }
              ]}
              required
            />
            
            <FormField
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              required
              placeholder="9876543210"
            />
            
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="john@company.com"
            />
            
            <FormField
              label="Monthly Salary"
              type="number"
              value={formData.salary}
              onChange={(value) => setFormData({ ...formData, salary: value })}
              placeholder="25000"
            />
            
            <FormField
              label="Join Date"
              type="date"
              value={formData.join_date}
              onChange={(value) => setFormData({ ...formData, join_date: value })}
              required
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
            label="Address"
            type="textarea"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
            placeholder="Full address..."
          />
          
          <FormField
            label="Bank Details"
            type="textarea"
            value={formData.bank_details}
            onChange={(value) => setFormData({ ...formData, bank_details: value })}
            placeholder="Bank account details for salary payments..."
          />

          <FormField
            label="KYC Details"
            type="textarea"
            value={formData.kyc_details}
            onChange={(value) => setFormData({ ...formData, kyc_details: value })}
            placeholder="Enter KYC information (PAN, Aadhaar, etc.)"
          />
                    
          <FormField
            label="Emergency Contact"
            value={formData.emergency_contact}
            onChange={(value) => setFormData({ ...formData, emergency_contact: value })}
            placeholder="Name and phone number of emergency contact"
          />
          
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(value) => setFormData({ ...formData, notes: value })}
            placeholder="Additional notes about the staff member..."
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
              {editingStaff ? 'Update' : 'Add'} Staff Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default StaffAgentEntry;