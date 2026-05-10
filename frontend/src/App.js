import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LandingPage from './LandingPage';
import Login from './Login';

import Dashboard from './Dashboard';
import Patients from './Patients';
import Doctors from './Doctors';
import Medicines from './Medicines';
import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import Reports from './Reports';
import  Views from './Views';

// ROLE PAGES

import AdminDashboard from './roles/AdminDashboard';

import DoctorPanel from './roles/DoctorPanel';

import Inventory from './roles/Inventory';

import PatientDashboard from './roles/PatientDashboard';

import ReceptionistDashboard from './roles/ReceptionistDashboard';


function App() {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  return (

    <Router>

      <Routes>

        {/* LANDING PAGE */}

        <Route
          path="/"
          element={<LandingPage />}
        />
        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ADMIN */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* DOCTOR */}

        <Route
          path="/doctor-panel"
          element={<DoctorPanel />}
        />

        {/* PHARMACIST */}

        <Route
          path="/inventory"
          element={<Inventory />}
        />

        {/* RECEPTIONIST */}

        <Route
          path="/receptionist-dashboard"
          element={<ReceptionistDashboard />}
        />

        {/* PATIENT */}

        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />

        {/* DEFAULT SYSTEM */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/patients"
          element={<Patients />}
        />

        <Route
          path="/doctors"
          element={<Doctors />}
        />

        <Route
          path="/medicines"
          element={<Medicines />}
        />

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        <Route
          path="/prescriptions"
          element={<Prescriptions />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />
<Route path="/views" element={<Views />} />
      
   </Routes>

    </Router>

  );
}
export default App;