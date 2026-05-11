import React, { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    Pill, 
    ClipboardList, 
    Package, 
    AlertTriangle, 
    TrendingUp, 
    Plus, 
    MinusCircle, 
    Search, 
    Edit, 
    Trash2, 
    LogOut,
    Building2,
    ChevronLeft,
    ChevronRight,
    Wallet
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function PharmacistDashboard() {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [medicines, setMedicines] = useState([]);
    const [usageData, setUsageData] = useState([]);
    const [issueHistory, setIssueHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({ name: '', quantity: '', price: '' });
    const [issueForm, setIssueForm] = useState({ medicine_id: '', quantity: '' });

    // Get User Details
    const user = JSON.parse(localStorage.getItem('user'));
    const loginName = user?.username || "pharmacist1";

    // --- INITIAL DATA LOAD ---
    useEffect(() => {
        loadAllData();
    }, []);

    async function loadAllData() {
        try {
            const [medsRes, usageRes, historyRes] = await Promise.all([
                fetch(`${API_URL}/medicines`),
                fetch(`${API_URL}/medicines/with-usage`),
                fetch(`${API_URL}/medicines/issue-history`)
            ]);

            const medsData = await medsRes.json();
            const usageDataRaw = await usageRes.json();
            const historyData = await historyRes.json();

            setMedicines(Array.isArray(medsData) ? medsData : []);
            setUsageData(Array.isArray(usageDataRaw) ? usageDataRaw : []);
            setIssueHistory(Array.isArray(historyData) ? historyData : []);
        } catch (err) {
            console.error("Error loading data:", err);
        }
    }

    // --- ACTIONS ---
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, quantity: Number(form.quantity), price: Number(form.price) })
            });
            if (res.ok) {
                setMessage('Medicine added successfully ✅');
                setForm({ name: '', quantity: '', price: '' });
                loadAllData();
            }
        } catch { setMessage('Server error ❌'); }
        setTimeout(() => setMessage(''), 4000);
    }

    async function issueMedicine(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/medicines/reduce-stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medicine_id: issueForm.medicine_id, quantity: Number(issueForm.quantity) })
            });
            if (res.ok) {
                setMessage('Medicine issued successfully ✅');
                setIssueForm({ medicine_id: '', quantity: '' });
                loadAllData();
            } else {
                const data = await res.json();
                setMessage(data.error || 'Failed ❌');
            }
        } catch { setMessage('Server error ❌'); }
        setTimeout(() => setMessage(''), 4000);
    }

    async function updateStock(id, currentQty) {
        const med = medicines.find(m => (m.medicine_id || m.id) === id);
        const newQty = prompt(`Updating ${med.name}\nEnter new total quantity:`, currentQty);
        if (newQty === null || newQty === "" || isNaN(newQty)) return;

        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: med.name, quantity: Number(newQty), price: med.price })
            });
            if (res.ok) {
                setMessage('Stock updated ✅');
                loadAllData();
            }
        } catch { setMessage('Update failed ❌'); }
        setTimeout(() => setMessage(''), 4000);
    }

    async function deleteMedicine(id) {
        if (!window.confirm('Delete this medicine from inventory?')) return;
        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('Medicine deleted ✅');
                loadAllData();
            }
        } catch { setMessage('Delete failed ❌'); }
        setTimeout(() => setMessage(''), 4000);
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    // --- LOGIC CALCULATIONS ---
    const totalInventoryValue = medicines.reduce((sum, m) => sum + (Number(m.quantity) * Number(m.price || 0)), 0);
    const lowStockCount = medicines.filter(m => Number(m.quantity) < 10).length;
    const issuedToday = issueHistory.filter(h => new Date(h.issued_date).toDateString() === new Date().toDateString()).length;

    const filteredMeds = (usageData.length > 0 ? usageData : medicines).filter(m => 
        (m.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={pageLayout}>
            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div style={sidebarHeader}>
                    <div style={sidebarLogo}><Building2 size={24} color="white" /></div>
                    <div>
                        <div style={sidebarTitle}>Health Care Hospital</div>
                        <div style={sidebarSub}>Pharmacist Portal</div>
                    </div>
                </div>

                <div style={sidebarNav}>
                    <div style={activeTab === 'dashboard' ? activeNavItem : navItem} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={24} /> Dashboard
                    </div>
                    <div style={activeTab === 'inventory' ? activeNavItem : navItem} onClick={() => setActiveTab('inventory')}>
                        <Package size={24} /> Inventory
                    </div>
                    <div style={activeTab === 'prescriptions' ? activeNavItem : navItem} onClick={() => setActiveTab('prescriptions')}>
                        <ClipboardList size={24} /> Prescriptions
                    </div>
                </div>

                <div style={sidebarProfileSection}>
                    <div style={profileInfo}>
                        <div style={profileAvatar}>👨‍🔬</div>
                        <div>
                            <div style={profileName}>Pharmacist</div>
                            <div style={profileRole}>{loginName}</div>
                        </div>
                    </div>
                    <button onClick={logout} style={sidebarLogoutBtn}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={mainContentStyle}>
                
                {/* BANNER WITH IMAGE */}
                <div style={bannerStyle}>
                    <div style={bannerTextContainer}>
                        <h1 style={{ margin: 0, fontSize: '38px', fontWeight: '800' }}>
                            Welcome, Pharmacist!
                        </h1>
                        <p style={{ marginTop: '12px', opacity: 0.9, fontSize: '20px' }}>
                            Manage medicines, inventory and prescriptions efficiently.
                        </p>
                    </div>
                    <div style={bannerImageContainer}>
                        {/* Make sure to place pharmacist-hero.png in your public folder */}
                        <img src="/pharmacist-hero.png" alt="Hero" style={bannerImage} 
                             onError={(e) => e.target.src = "https://img.freepik.com/free-vector/pharmacist-concept-illustration_114360-2649.jpg"} />
                    </div>
                </div>

                {message && <div style={messageStyle}>{message}</div>}

                {activeTab === 'dashboard' && (
                    <>
                        {/* HIGHLIGHTED STATS */}
                        <div style={statsGrid}>
                            <div style={statCard}>
                                <div style={statTopRow}><Package size={32} color="#16a34a" /></div>
                                <div style={statValue}>{medicines.length}</div>
                                <div style={statLabel}>Total Medicines</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}><AlertTriangle size={32} color="#dc2626" /></div>
                                <div style={{...statValue, color: '#dc2626'}}>{lowStockCount}</div>
                                <div style={statLabel}>Low Stock Items</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}><ClipboardList size={32} color="#9333ea" /></div>
                                <div style={statValue}>{issuedToday}</div>
                                <div style={statLabel}>Issued Today</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}><Wallet size={32} color="#0284c7" /></div>
                                <div style={statValue}>Rs. {totalInventoryValue.toLocaleString()}</div>
                                <div style={statLabel}>Inventory Value</div>
                            </div>
                        </div>

                        {/* FORMS SECTION */}
                        <div style={formsGrid}>
                            <div style={panelCard}>
                                <h2 style={panelTitle}>➕ Add New Medicine</h2>
                                <form onSubmit={handleSubmit} style={formStyle}>
                                    <input placeholder='Medicine Name' value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
                                    <div style={{display: 'flex', gap: '20px'}}>
                                        <input type='number' placeholder='Qty' value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required style={inputStyle} />
                                        <input type='number' placeholder='Price' value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={inputStyle} />
                                    </div>
                                    <button type='submit' style={primaryBtn}>Add Medicine</button>
                                </form>
                            </div>
                            <div style={panelCard}>
                                <h2 style={panelTitle}>💊 Issue to Patient</h2>
                                <form onSubmit={issueMedicine} style={formStyle}>
                                    <select value={issueForm.medicine_id} onChange={e => setIssueForm({...issueForm, medicine_id: e.target.value})} required style={inputStyle}>
                                        <option value=''>Select Medicine</option>
                                        {medicines.map(m => <option key={m.medicine_id || m.id} value={m.medicine_id || m.id}>{m.name} (Stock: {m.quantity})</option>)}
                                    </select>
                                    <input type='number' placeholder='Quantity to Issue' value={issueForm.quantity} onChange={e => setIssueForm({...issueForm, quantity: e.target.value})} required style={inputStyle} />
                                    <button type='submit' style={tealBtn}>Confirm Issue</button>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* INVENTORY TABLE - LARGE FONT & SEARCH */}
                <div style={{...panelCard, marginTop: '30px'}}>
                    <div style={tableHeaderArea}>
                        <h2 style={panelTitle}>📦 Inventory Management</h2>
                        <div style={searchWrapper}>
                            <Search size={22} color="#94a3b8" style={searchIcon} />
                            <input placeholder='Search medicines...' value={search} onChange={e => setSearch(e.target.value)} style={searchInput} />
                        </div>
                    </div>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderRow}>
                                <th style={tableHead}>Medicine Name</th>
                                <th style={tableHead}>Quantity</th>
                                <th style={tableHead}>Price (Rs.)</th>
                                <th style={tableHead}>Status</th>
                                <th style={tableHead}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMeds.map((med, i) => {
                                const isLow = Number(med.quantity) < 10;
                                return (
                                    <tr key={i} style={tableRow}>
                                        <td style={{...tableData, fontWeight: 'bold', fontSize: '18px'}}>{med.name}</td>
                                        <td style={{...tableData, fontWeight: '900', color: isLow ? '#dc2626' : '#16a34a'}}>{med.quantity}</td>
                                        <td style={tableData}>{Number(med.price || 0).toFixed(2)}</td>
                                        <td style={tableData}>
                                            <span style={isLow ? statusLowBadge : statusOkBadge}>
                                                {isLow ? 'LOW STOCK' : 'IN STOCK'}
                                            </span>
                                        </td>
                                        <td style={tableData}>
                                            <div style={{display: 'flex', gap: '10px'}}>
                                                <button onClick={() => updateStock(med.medicine_id || med.id, med.quantity)} style={updateBtn}><Edit size={16}/> Update</button>
                                                <button onClick={() => deleteMedicine(med.medicine_id || med.id)} style={deleteBtn}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

// --- FULLY UPDATED STYLES ---
const pageLayout = { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" };

const sidebarStyle = { width: '300px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' };
const sidebarHeader = { padding: '30px 25px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const sidebarLogo = { background: '#0ea5e9', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sidebarTitle = { fontSize: '18px', fontWeight: 'bold' };
const sidebarSub = { fontSize: '14px', color: '#94a3b8' };

const sidebarNav = { padding: '25px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 };
const navItem = { display: 'flex', alignItems: 'center', gap: '18px', padding: '16px 20px', borderRadius: '12px', color: '#cbd5e1', cursor: 'pointer', fontSize: '18px', fontWeight: '600', transition: '0.2s' };
const activeNavItem = { ...navItem, background: 'linear-gradient(to right, #0ea5e9, #0284c7)', color: 'white' };

const sidebarProfileSection = { padding: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' };
const profileInfo = { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '25px' };
const profileAvatar = { width: '55px', height: '55px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' };
const profileName = { fontSize: '16px', fontWeight: 'bold' };
const profileRole = { fontSize: '14px', color: '#94a3b8' };
const sidebarLogoutBtn = { width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };

const mainContentStyle = { flex: 1, padding: '50px', overflowY: 'auto' };

const bannerStyle = { position: 'relative', background: 'linear-gradient(to right, #0284c7, #0f766e)', borderRadius: '24px', padding: '0 50px', color: 'white', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', height: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const bannerTextContainer = { zIndex: 2, flex: 1 };
const bannerImageContainer = { height: '100%', display: 'flex', alignItems: 'flex-end', zIndex: 1 };
const bannerImage = { height: '240px', width: 'auto', objectFit: 'contain' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '50px' };
const statCard = { background: 'white', padding: '30px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const statTopRow = { marginBottom: '15px' };
const statValue = { fontSize: '42px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' };
const statLabel = { fontSize: '16px', color: '#64748b', fontWeight: 'bold' };

const formsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' };
const panelCard = { background: 'white', padding: '35px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const panelTitle = { margin: '0 0 30px 0', fontSize: '24px', fontWeight: '900', color: '#0f172a' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '22px' };
const inputStyle = { width: '100%', padding: '18px', borderRadius: '14px', border: '2px solid #e2e8f0', background: '#f8fafc', boxSizing: 'border-box', fontSize: '17px', outline: 'none' };
const primaryBtn = { padding: '18px', border: 'none', borderRadius: '14px', background: '#0284c7', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' };
const tealBtn = { padding: '18px', border: 'none', borderRadius: '14px', background: '#0f766e', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' };

const tableHeaderArea = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' };
const searchWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const searchIcon = { position: 'absolute', left: '18px' };
const searchInput = { padding: '16px 16px 16px 52px', borderRadius: '14px', border: '2px solid #e2e8f0', width: '380px', fontSize: '17px', outline: 'none' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { borderBottom: '3px solid #e2e8f0' };
const tableHead = { padding: '20px 15px', color: '#475569', fontSize: '15px', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px' };
const tableRow = { borderBottom: '1px solid #f1f5f9' };
const tableData = { padding: '22px 15px', fontSize: '17px', color: '#1e293b' };

const statusOkBadge = { background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold' };
const statusLowBadge = { background: '#ffedd5', color: '#ea580c', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold' };

const updateBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#0284c7', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' };
const deleteBtn = { padding: '12px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' };

const messageStyle = { padding: '20px', borderRadius: '15px', fontWeight: 'bold', marginBottom: '35px', fontSize: '18px', background: '#dcfce7', color: '#166534', border: '2px solid #bbf7d0' };