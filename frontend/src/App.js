import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Patients from './Patients';
import Doctors from './Doctors';
import Medicines from './Medicines';
import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import Reports from './Reports';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1>Healthcare & Inventory Management System</h1>
            <p>Manage patients, doctors, medicines, appointments, prescriptions, and reports in one student-friendly interface.</p>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
