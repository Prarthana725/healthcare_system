import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Healthcare System</div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/patients" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Patients
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Doctors
        </NavLink>
        <NavLink to="/medicines" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Medicines
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Appointments
        </NavLink>
        <NavLink to="/prescriptions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Prescriptions
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
