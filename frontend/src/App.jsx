import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Clients from './pages/Clients';
import Debts from './pages/Debts';
import Ayoub from './pages/Ayoub';
import CashBalance from './pages/CashBalance';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <div className="app-layout">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/ayoub" element={<Ayoub />} />
                    <Route path="/cash-balance" element={<CashBalance />} />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
