import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [totals, setTotals] = useState({ patients: 0, doctors: 0, medicines: 0 });
  
  const [overviewStats, setOverviewStats] = useState({
      totalUsers: 0,
      activeUsers: 0,
      loginsToday: 0,
      totalActivities: 0
  });

  useEffect(() => {
    async function loadCounts() {
      try {
        const [patientsRes, doctorsRes, medicinesRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/patients`),
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/medicines`),
          fetch(`${API_URL}/stats/overview`) 
        ]);

        const patients = patientsRes.ok ? await patientsRes.json() : [];
        const doctors = doctorsRes.ok ? await doctorsRes.json() : [];
        const medicines = medicinesRes.ok ? await medicinesRes.json() : [];
        const stats = statsRes.ok ? await statsRes.json() : null;

        setTotals({
          patients: Array.isArray(patients) ? patients.length : 0,
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          medicines: Array.isArray(medicines) ? medicines.length : 0
        });

        if (stats && !stats.error) {
            setOverviewStats(stats);
        }

      } catch (error) {
        console.error("Dashboard data load error:", error);
        setTotals({ patients: 0, doctors: 0, medicines: 0 });
      }
    }

    loadCounts();
  }, []);

  return (
    <div className="page-content">
      <h2>Dashboard</h2>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Patients</div>
          <div className="card-value">{totals.patients}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Doctors</div>
          <div className="card-value">{totals.doctors}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Medicines</div>
          <div className="card-value">{totals.medicines}</div>
        </div>
      </div>

      <br />

      {/* System Overview Banner with Real Data & Layout */}
      <div className="system-overview-banner" style={{ background: '#111827', color: 'white', padding: '20px 30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        
        <div className="overview-title">
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>System Overview</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#9ca3af' }}>Quick overview of system statistics</p>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            
            {/* Total Users */}
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#3b0764', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>👥</span> {/* ඔයාගේ මුල් Icon එක මෙතැනට දාගන්න */}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{overviewStats.totalUsers}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Total Users</p>
                </div>
            </div>

            {/* Active Users */}
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#1f2937', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{overviewStats.activeUsers}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Active Users</p>
                </div>
            </div>

            {/* Total Logins Today */}
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#1f2937', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{overviewStats.loginsToday}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Total Logins Today</p>
                </div>
            </div>

            {/* Total Activities */}
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#1f2937', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>📋</span>
                </div>
                <div>
                    <h3 className="stat-value">{overviewStats.totalActivities}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Total Activities</p>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;