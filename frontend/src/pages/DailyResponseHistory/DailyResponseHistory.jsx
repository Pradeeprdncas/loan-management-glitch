import { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PageHeader from '../../components/UI/PageHeader';
import TabContainer from '../../components/UI/TabContainer';
import Table from '../../components/UI/Table';
import FormField from '../../components/UI/FormField';

function DailyResponseHistory() {
  const { state } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [responseType, setResponseType] = useState('all');
  
  // Mock daily response data
  const responseHistory = [
    {
      id: 1,
      date: selectedDate,
      customerCode: 'CUS001',
      customerName: 'John Doe',
      staffCode: 'STF001',
      staffName: 'Alice Manager',
      responseType: 'Phone Call',
      responseTime: '10:30 AM',
      duration: '15 mins',
      status: 'Completed',
      outcome: 'Payment Confirmed',
      notes: 'Customer confirmed payment for next EMI on time',
      followUpRequired: false,
      priority: 'Medium'
    },
    {
      id: 2,
      date: selectedDate,
      customerCode: 'CUS002',
      customerName: 'Jane Smith',
      staffCode: 'STF002',
      staffName: 'Bob Agent',
      responseType: 'SMS',
      responseTime: '02:15 PM',
      duration: 'N/A',
      status: 'Sent',
      outcome: 'Payment Reminder Sent',
      notes: 'Reminder sent for overdue EMI payment',
      followUpRequired: true,
      priority: 'High'
    },
    {
      id: 3,
      date: selectedDate,
      customerCode: 'CUS003',
      customerName: 'Bob Johnson',
      staffCode: 'AGT001',
      staffName: 'Carol Agent',
      responseType: 'Email',
      responseTime: '11:45 AM',
      duration: 'N/A',
      status: 'Delivered',
      outcome: 'Document Request Sent',
      notes: 'Requested updated bank statements for loan processing',
      followUpRequired: true,
      priority: 'Medium'
    },
    {
      id: 4,
      date: selectedDate,
      customerCode: 'CUS001',
      customerName: 'John Doe',
      staffCode: 'STF001',
      staffName: 'Alice Manager',
      responseType: 'WhatsApp',
      responseTime: '04:20 PM',
      duration: '5 mins',
      status: 'Read',
      outcome: 'Query Resolved',
      notes: 'Customer query about interest calculation resolved',
      followUpRequired: false,
      priority: 'Low'
    }
  ];

  // Filter responses based on search criteria
  const filteredResponses = responseHistory.filter(response => {
    const matchesCode = !searchCode || 
      response.customerCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      response.staffCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      response.customerName.toLowerCase().includes(searchCode.toLowerCase());
    
    const matchesType = responseType === 'all' || response.responseType === responseType;
    
    return matchesCode && matchesType;
  });

  const columns = [
    { key: 'responseTime', header: 'Time' },
    { key: 'customerCode', header: 'Customer Code' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'staffCode', header: 'Staff Code' },
    { key: 'staffName', header: 'Staff Name' },
    { 
      key: 'responseType', 
      header: 'Response Type',
      render: (value) => {
        let icon;
        let colorClass;
        
        switch(value) {
          case 'Phone Call':
            icon = <Phone className="h-4 w-4" />;
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          case 'SMS':
            icon = <MessageSquare className="h-4 w-4" />;
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'Email':
            icon = <Mail className="h-4 w-4" />;
            colorClass = 'bg-purple-100 text-purple-800';
            break;
          case 'WhatsApp':
            icon = <MessageSquare className="h-4 w-4" />;
            colorClass = 'bg-green-100 text-green-800';
            break;
          default:
            icon = <MessageSquare className="h-4 w-4" />;
            colorClass = 'bg-gray-100 text-gray-800';
        }
        
        return (
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {icon}
            <span className="ml-1">{value}</span>
          </span>
        );
      }
    },
    { key: 'duration', header: 'Duration' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Completed' ? 'bg-green-100 text-green-800' : 
          value === 'Sent' || value === 'Delivered' ? 'bg-blue-100 text-blue-800' :
          value === 'Read' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'outcome', header: 'Outcome' },
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
      key: 'followUpRequired', 
      header: 'Follow-up',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {value ? 'Required' : 'Complete'}
        </span>
      )
    }
  ];

  const responseStats = {
    totalResponses: filteredResponses.length,
    phoneResponses: filteredResponses.filter(r => r.responseType === 'Phone Call').length,
    smsResponses: filteredResponses.filter(r => r.responseType === 'SMS').length,
    emailResponses: filteredResponses.filter(r => r.responseType === 'Email').length,
    whatsappResponses: filteredResponses.filter(r => r.responseType === 'WhatsApp').length,
    completedResponses: filteredResponses.filter(r => r.status === 'Completed').length,
    followUpRequired: filteredResponses.filter(r => r.followUpRequired).length
  };

  const historyContent = (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        
        <FormField
          label="Search Code/Name"
          value={searchCode}
          onChange={setSearchCode}
          placeholder="Enter customer/staff code or name..."
        />
        
        <FormField
          label="Response Type"
          type="select"
          value={responseType}
          onChange={setResponseType}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'Phone Call', label: 'Phone Call' },
            { value: 'SMS', label: 'SMS' },
            { value: 'Email', label: 'Email' },
            { value: 'WhatsApp', label: 'WhatsApp' }
          ]}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-900">{responseStats.totalResponses}</p>
          <p className="text-blue-700 text-xs">Total Responses</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <Phone className="h-6 w-6 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-900">{responseStats.phoneResponses}</p>
          <p className="text-green-700 text-xs">Phone Calls</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <Mail className="h-6 w-6 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-900">{responseStats.emailResponses}</p>
          <p className="text-purple-700 text-xs">Emails</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <MessageSquare className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-yellow-900">{responseStats.smsResponses}</p>
          <p className="text-yellow-700 text-xs">SMS</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <MessageSquare className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-emerald-900">{responseStats.whatsappResponses}</p>
          <p className="text-emerald-700 text-xs">WhatsApp</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
          <Clock className="h-6 w-6 text-teal-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-teal-900">{responseStats.completedResponses}</p>
          <p className="text-teal-700 text-xs">Completed</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-orange-900">{responseStats.followUpRequired}</p>
          <p className="text-orange-700 text-xs">Follow-up</p>
        </div>
      </div>
      
      <Table columns={columns} data={filteredResponses} />
    </div>
  );

  const analyticsContent = (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Response Type Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Calls:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(responseStats.phoneResponses / responseStats.totalResponses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-blue-600">{responseStats.phoneResponses}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SMS:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(responseStats.smsResponses / responseStats.totalResponses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-green-600">{responseStats.smsResponses}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emails:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(responseStats.emailResponses / responseStats.totalResponses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-purple-600">{responseStats.emailResponses}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">WhatsApp:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${(responseStats.whatsappResponses / responseStats.totalResponses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-emerald-600">{responseStats.whatsappResponses}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Response Effectiveness</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate:</span>
                  <span className="font-medium text-green-600">
                    {((responseStats.completedResponses / responseStats.totalResponses) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Follow-up Required:</span>
                  <span className="font-medium text-yellow-600">
                    {((responseStats.followUpRequired / responseStats.totalResponses) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Response Time:</span>
                  <span className="font-medium text-blue-600">2.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate:</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Table columns={columns} data={responseHistory} />
    </div>
  );

  const tabs = [
    { label: 'Entry Details', content: historyContent },
    { label: 'View/Edit Details', content: analyticsContent }
  ];

  return (
    <div>
      <PageHeader 
        title="Daily Response History" 
        subtitle="Track and analyze daily customer response activities and communication"
      />
      
      <TabContainer tabs={tabs} />
    </div>
  );
}

export default DailyResponseHistory;