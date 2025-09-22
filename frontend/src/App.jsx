import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import EntryLevelManagement from './pages/EntryLevelManagement/EntryLevelManagement';
import CustomerApproval from './pages/CustomerApproval/CustomerApproval';
import LoanEntry from './pages/LoanEntry/LoanEntry';
import PaymentReceived from './pages/PaymentReceived/PaymentReceived';
import OverallReportEMI from './pages/Reports/OverallReportEMI';
import TodayReport from './pages/Reports/TodayReport';
import TodayWorkAllocation from './pages/WorkAllocation/TodayWorkAllocation';
import CustomerLoanHistory from './pages/CustomerLoanHistory/CustomerLoanHistory';
import AccountSheet from './pages/AccountSheet/AccountSheet';
import DailyResponseHistory from './pages/DailyResponseHistory/DailyResponseHistory';
import Investors from './pages/Investors/Investors';
import AgentPerformance from './pages/AgentPerformance/AgentPerformance';
import StaffAgentEntry from './pages/StaffAgentEntry/StaffAgentEntry';
import CustomerEntry from './pages/CustomerEntry/CustomerEntry';
import CalculationSheet from './pages/CalculationSheet/CalculationSheet';
import Entry from './pages/Entrypage/entry';  
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="entry-level" element={<EntryLevelManagement />} />
              <Route path="entrypage" element={<Entry />} />
              <Route path="customer-approval" element={<CustomerApproval />} />
              <Route path="loan-entry" element={<LoanEntry />} />
              <Route path="payment-received" element={<PaymentReceived />} />
              <Route path="overall-report-emi" element={<OverallReportEMI />} />
              <Route path="today-report" element={<TodayReport />} />
              <Route path="work-allocation" element={<TodayWorkAllocation />} />
              <Route path="customer-history" element={<CustomerLoanHistory />} />
              <Route path="account-sheet" element={<AccountSheet />} />
              <Route path="daily-response" element={<DailyResponseHistory />} />
              <Route path="investors" element={<Investors />} />
              <Route path="agent-performance" element={<AgentPerformance />} />
              <Route path="staff-agent-entry" element={<StaffAgentEntry />} />
              <Route path="customer-entry" element={<CustomerEntry />} />
              <Route path="calculation-sheet" element={<CalculationSheet />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;