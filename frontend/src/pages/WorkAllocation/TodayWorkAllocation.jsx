import { useState } from 'react';
import { UserCheck, Users, Target, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import FormField from '../../components/UI/FormField';

function TodayWorkAllocation() {
  const { state } = useApp();
  const [staffCode, setStaffCode] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock work allocation data
  const workAllocations = [
    {
      id: 1,
      staffCode: 'STF001',
      staffName: 'Alice Manager',
      task: 'Customer Approval Review',
      customerCount: 15,
      priority: 'High',
      status: 'In Progress',
      deadline: selectedDate,
      completed: 8
    },
    {
      id: 2,
      staffCode: 'STF002',
      staffName: 'Bob Agent',
      task: 'Payment Collection',
      customerCount: 12,
      priority: 'Medium',
      status: 'Pending',
      deadline: selectedDate,
      completed: 0
    },
    {
      id: 3,
      staffCode: 'AGT001',
      staffName: 'Carol Agent',
      task: 'Loan Documentation',
      customerCount: 8,
      priority: 'High',
      status: 'Completed',
      deadline: selectedDate,
      completed: 8
    }
  ];

  const customerContacts = [
    {
      id: 1,
      customerCode: 'CUS001',
      customerName: 'John Doe',
      assignedTo: 'STF001',
      staffName: 'Alice Manager',
      taskType: 'Approval Follow-up',
      contactTime: '10:00 AM',
      status: 'Contacted',
      notes: 'Documents verified, approval pending'
    },
    {
      id: 2,
      customerCode: 'CUS002',
      customerName: 'Jane Smith',
      assignedTo: 'STF002',
      staffName: 'Bob Agent',
      taskType: 'Payment Reminder',
      contactTime: '11:30 AM',
      status: 'Pending',
      notes: 'EMI due today'
    }
  ];

  // Filter by staff code if provided
  const filteredAllocations = staffCode 
    ? workAllocations.filter(allocation => 
        allocation.staffCode.toLowerCase().includes(staffCode.toLowerCase())
      )
    : workAllocations;

  const filteredContacts = staffCode 
    ? customerContacts.filter(contact => 
        contact.assignedTo.toLowerCase().includes(staffCode.toLowerCase())
      )
    : customerContacts;

  const allocationColumns = [
    { key: 'staffCode', header: 'Staff Code' },
    { key: 'staffName', header: 'Staff Name' },
    { key: 'task', header: 'Task Description' },
    { key: 'customerCount', header: 'Customer Count' },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'High' ? 'bg-red-100 text-red-800' : 
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Completed' ? 'bg-green-100 text-green-800' : 
          value === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'progress', 
      header: 'Progress',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(row.completed / row.customerCount) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {row.completed}/{row.customerCount}
          </span>
        </div>
      )
    },
    { key: 'deadline', header: 'Deadline' }
  ];

  const contactColumns = [
    { key: 'customerCode', header: 'Customer Code' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'assignedTo', header: 'Staff Code' },
    { key: 'staffName', header: 'Staff Name' },
    { key: 'taskType', header: 'Task Type' },
    { key: 'contactTime', header: 'Scheduled Time' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Contacted' ? 'bg-green-100 text-green-800' : 
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'notes', header: 'Notes' }
  ];

  const summaryStats = {
    totalTasks: workAllocations.length,
    completedTasks: workAllocations.filter(w => w.status === 'Completed').length,
    inProgressTasks: workAllocations.filter(w => w.status === 'In Progress').length,
    pendingTasks: workAllocations.filter(w => w.status === 'Pending').length,
    totalCustomers: workAllocations.reduce((sum, w) => sum + w.customerCount, 0),
    contactedCustomers: customerContacts.filter(c => c.status === 'Contacted').length
  };

  const allocationContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        
        <FormField
          label="Staff Code"
          value={staffCode}
          onChange={setStaffCode}
          placeholder="Enter staff code to filter..."
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">{summaryStats.totalTasks}</p>
          <p className="text-blue-700 text-sm">Total Tasks</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-900">{summaryStats.completedTasks}</p>
          <p className="text-green-700 text-sm">Completed</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-900">{summaryStats.inProgressTasks}</p>
          <p className="text-yellow-700 text-sm">In Progress</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{summaryStats.totalCustomers}</p>
          <p className="text-gray-700 text-sm">Customers</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Work Allocation for {selectedDate}</h3>
          <Table columns={allocationColumns} data={filteredAllocations} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Contact Schedule</h3>
          <Table columns={contactColumns} data={filteredContacts} />
        </div>
      </div>
    </div>
  );

  const performanceContent = (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.staff.map(member => {
              const memberTasks = workAllocations.filter(() => Math.random() > 0.5); // Mock assignment
              const completedTasks = memberTasks.filter(t => t.status === 'Completed').length;
              const efficiency = memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0;
              
              return (
                <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <span className="text-sm text-gray-600">{member.code}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tasks Assigned:</span>
                      <span className="font-medium">{memberTasks.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{completedTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className={`font-medium ${efficiency >= 80 ? 'text-green-600' : efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {efficiency.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <Table columns={allocationColumns} data={workAllocations} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: allocationContent },
    { label: 'View/Edit Details', content: performanceContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Today Work Allocation" 
        subtitle="Daily staff work allocation and task management"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default TodayWorkAllocation;