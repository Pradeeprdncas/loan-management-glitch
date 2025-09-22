import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state with sample data
const initialState = {
  // Dashboard summary
  summary: {
    totalLeads: 1247,
    activeLoans: 342,
    pendingApprovals: 23,
    todaysPayments: 156,
    overduePayments: 12,
    totalRevenue: 2845650
  },
  
  // Entry levels
  entryLevels: [
    { id: 1, level: 'Bronze', minAmount: 10000, maxAmount: 50000, interestRate: 12, status: 'active' },
    { id: 2, level: 'Silver', minAmount: 50001, maxAmount: 100000, interestRate: 10, status: 'active' },
    { id: 3, level: 'Gold', minAmount: 100001, maxAmount: 200000, interestRate: 8, status: 'active' },
    { id: 4, level: 'Platinum', minAmount: 200001, maxAmount: 500000, interestRate: 6, status: 'active' }
  ],
  
  // Customers
  customers: [
    { id: 1, code: 'CUS001', name: 'John Doe', phone: '9876543210', email: 'john@example.com', status: 'approved', level: 'Gold', joinDate: '2024-01-15' },
    { id: 2, code: 'CUS002', name: 'Jane Smith', phone: '9876543211', email: 'jane@example.com', status: 'pending', level: 'Silver', joinDate: '2024-01-16' },
    { id: 3, code: 'CUS003', name: 'Bob Johnson', phone: '9876543212', email: 'bob@example.com', status: 'waiting', level: 'Bronze', joinDate: '2024-01-17' }
  ],
  
  // Loans
  loans: [
    { id: 1, loanNumber: 'LN001', customerId: 1, customerName: 'John Doe', amount: 150000, type: 'EMI', interestRate: 8, tenure: 24, status: 'active', startDate: '2024-01-20', nextPayment: '2024-02-20' },
    { id: 2, loanNumber: 'LN002', customerId: 2, customerName: 'Jane Smith', amount: 75000, type: 'Normal', interestRate: 10, tenure: 12, status: 'active', startDate: '2024-01-18', nextPayment: '2024-02-18' }
  ],
  
  // Payments
  payments: [
    { id: 1, loanId: 1, loanNumber: 'LN001', customerName: 'John Doe', amount: 7500, paymentDate: '2024-01-20', status: 'received', method: 'Bank Transfer' },
    { id: 2, loanId: 2, loanNumber: 'LN002', customerName: 'Jane Smith', amount: 6800, paymentDate: '2024-01-18', status: 'pending', method: 'Cash' }
  ],
  
  // Staff & Agents
  staff: [
    { id: 1, code: 'STF001', name: 'Alice Manager', role: 'Manager', phone: '9876543220', status: 'active', joinDate: '2023-06-01' },
    { id: 2, code: 'STF002', name: 'Bob Agent', role: 'Agent', phone: '9876543221', status: 'active', joinDate: '2023-08-15' },
    { id: 3, code: 'AGT001', name: 'Carol Agent', role: 'Agent', phone: '9876543222', status: 'active', joinDate: '2023-09-10' }
  ],
  
  // Investors
  investors: [
    { id: 1, name: 'Investment Corp A', amount: 5000000, returnRate: 12, investmentDate: '2023-01-01', status: 'active' },
    { id: 2, name: 'Private Investor B', amount: 2000000, returnRate: 15, investmentDate: '2023-03-15', status: 'active' }
  ],
  
  // Notifications
  notifications: [
    { id: 1, message: 'New loan application received', type: 'info', timestamp: new Date().toISOString() },
    { id: 2, message: 'Payment overdue for LN003', type: 'warning', timestamp: new Date().toISOString() }
  ]
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTRY_LEVEL':
      return {
        ...state,
        entryLevels: [...state.entryLevels, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_ENTRY_LEVEL':
      return {
        ...state,
        entryLevels: state.entryLevels.map(level => 
          level.id === action.payload.id ? action.payload : level
        )
      };
    case 'DELETE_ENTRY_LEVEL':
      return {
        ...state,
        entryLevels: state.entryLevels.filter(level => level.id !== action.payload)
      };
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer => 
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    case 'ADD_LOAN':
      return {
        ...state,
        loans: [...state.loans, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(loan => 
          loan.id === action.payload.id ? action.payload : loan
        )
      };
    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [...state.payments, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment => 
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    case 'ADD_STAFF':
      return {
        ...state,
        staff: [...state.staff, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map(member => 
          member.id === action.payload.id ? action.payload : member
        )
      };
    case 'ADD_INVESTOR':
      return {
        ...state,
        investors: [...state.investors, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_INVESTOR':
      return {
        ...state,
        investors: state.investors.map(investor => 
          investor.id === action.payload.id ? action.payload : investor
        )
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [{ ...action.payload, id: Date.now(), timestamp: new Date().toISOString() }, ...state.notifications]
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
}

// Context Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('adminPanelData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // You could dispatch actions to load this data, but for simplicity, we'll use initial state
    }
  }, []);
  
  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('adminPanelData', JSON.stringify(state));
  }, [state]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}