import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon as ClockIcon2,
  BuildingOfficeIcon,
  UserPlusIcon,
  CalculatorIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { id: '/', name: 'Dashboard', icon: HomeIcon },
  { id: '/entry-level', name: 'Entry Level Management', icon: UserGroupIcon },
  { id: '/customer-approval', name: 'Customer Approval & Waiting Levels', icon: ClockIcon },
  { id: '/loan-entry', name: 'Loan Entry', icon: CurrencyDollarIcon },
  { id: '/payment-received', name: 'Payment Received', icon: ReceiptPercentIcon },
  { id: '/overall-report-emi', name: 'Overall Report - EMI', icon: ChartBarIcon },
  { id: '/today-report', name: 'Today Report - EMI & Normal', icon: CalendarDaysIcon },
  { id: '/work-allocation', name: 'Today Work Allocation', icon: ClipboardDocumentListIcon },
  { id: '/customer-history', name: 'Customer Loan History & Holding', icon: UserIcon },
  { id: '/account-sheet', name: 'A/C Sheet', icon: DocumentTextIcon },
  { id: '/daily-response', name: 'Daily Response History', icon: ClockIcon2 },
  { id: '/investors', name: 'Investors', icon: BuildingOfficeIcon },
  { id: '/agent-performance', name: 'Agent Performance', icon: UserPlusIcon },
  { id: '/staff-agent-entry', name: 'Staff & Agent Entry', icon: UserGroupIcon },
  { id: '/customer-entry', name: 'Customer Entry', icon: UserIcon },
  { id: '/calculation-sheet', name: 'Calculation Sheet', icon: CalculatorIcon }
];

const Sidebar = () => {
  const { state, dispatch } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-semibold text-gray-800">Loan Admin</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center">
            Loan Management System v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
