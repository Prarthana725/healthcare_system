// LAYOUT
export const pageLayout = {
  display: 'flex',
  minHeight: '100vh',
  background: '#f8fafc',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

export const mainContentStyle = {
  flex: 1,
  padding: '50px',
  overflowY: 'auto'
};

// SIDEBAR
export const sidebarStyle = {
  width: '300px',
  background: '#0f172a',
  color: 'white',
  display: 'flex',
  flexDirection: 'column'
};

export const sidebarHeader = {
  padding: '30px 25px',
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  borderBottom: '1px solid rgba(255,255,255,0.05)'
};

export const sidebarLogo = {
  background: '#0ea5e9',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const sidebarTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};

export const sidebarSub = {
  fontSize: '14px',
  color: '#94a3b8',
  marginTop: '4px'
};

export const sidebarNav = {
  padding: '25px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flex: 1
};

export const navItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  padding: '16px 20px',
  borderRadius: '12px',
  color: '#cbd5e1',
  cursor: 'pointer',
  fontSize: '17px',
  transition: '0.2s',
  fontWeight: '600'
};

export const activeNavItem = {
  ...navItem,
  background: 'linear-gradient(to right, #0ea5e9, #0284c7)',
  color: 'white',
  fontWeight: 'bold'
};

export const sidebarProfileSection = {
  padding: '25px',
  borderTop: '1px solid rgba(255,255,255,0.05)'
};

export const profileInfo = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  marginBottom: '25px'
};

export const profileAvatar = {
  width: '55px',
  height: '55px',
  background: '#e2e8f0',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '26px'
};

export const profileName = {
  fontSize: '16px',
  fontWeight: 'bold'
};

export const profileRole = {
  fontSize: '14px',
  color: '#94a3b8',
  marginTop: '4px'
};

export const sidebarLogoutBtn = {
  width: '100%',
  padding: '14px',
  background: 'transparent',
  border: '2px solid rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: '0.2s'
};

// BANNER
export const bannerStyle = {
  position: 'relative',
  background: 'linear-gradient(to right, #0f766e, #0284c7)',
  borderRadius: '20px',
  padding: '45px 50px',
  color: 'white',
  marginBottom: '40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

export const bannerIllustration = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: '50px'
};

export const deskProp = {
  background: '#facc15',
  color: '#0f172a',
  padding: '6px 24px',
  fontWeight: '900',
  fontSize: '14px',
  borderRadius: '6px',
  marginTop: '-15px',
  letterSpacing: '1.5px',
  zIndex: 2
};

// STATS
export const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '25px',
  marginBottom: '40px'
};

export const statCard = {
  background: 'white',
  padding: '25px',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

export const statTopRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px'
};

export const iconBox = {
  width: '55px',
  height: '55px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const trendBadge = {
  padding: '6px 10px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 'bold'
};

export const statValue = {
  fontSize: '32px',
  fontWeight: '900',
  color: '#0f172a',
  marginBottom: '6px'
};

export const statLabel = {
  fontSize: '15px',
  color: '#64748b',
  fontWeight: '600'
};

// GRIDS
export const formsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px',
  marginBottom: '30px'
};

export const tablesGrid = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.8fr',
  gap: '30px',
  marginBottom: '40px'
};

// PANELS
export const panelCard = {
  background: 'white',
  padding: '30px',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

export const contentCard = {
  background: 'white',
  padding: '40px',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
};

export const tableHeaderArea = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

export const panelHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '25px'
};

export const panelTitle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '900',
  color: '#0f172a'
};

export const cardTitle = {
  margin: 0,
  fontSize: '26px',
  fontWeight: '900',
  color: '#0f172a'
};

export const viewAllBtn = {
  padding: '8px 18px',
  borderRadius: '10px',
  border: '2px solid #e2e8f0',
  background: 'white',
  color: '#0f172a',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '14px',
  transition: '0.2s'
};

// FORMS
export const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

export const inputWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

export const inputIcon = {
  position: 'absolute',
  left: '18px'
};

export const dropdownArrow = {
  position: 'absolute',
  right: '18px',
  pointerEvents: 'none'
};

export const iconInput = {
  width: '100%',
  padding: '16px 16px 16px 50px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  outline: 'none',
  fontSize: '16px',
  color: '#1e293b',
  boxSizing: 'border-box',
  appearance: 'none',
  background: '#f8fafc',
  fontWeight: '500'
};

export const primaryBtn = {
  padding: '16px',
  border: 'none',
  borderRadius: '12px',
  background: '#0284c7',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};

export const tealBtn = {
  padding: '16px',
  border: 'none',
  borderRadius: '12px',
  background: '#0f766e',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};

// SEARCH
export const searchWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  minWidth: '350px'
};

export const searchIcon = {
  position: 'absolute',
  left: '18px'
};

export const searchInputStyle = {
  width: '100%',
  padding: '14px 14px 14px 48px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  outline: 'none',
  background: '#f8fafc',
  fontSize: '16px',
  color: '#1e293b',
  boxSizing: 'border-box',
  fontWeight: '500'
};

// TABLES
export const tableStyle = { width: '100%', borderCollapse: 'collapse' };
export const tableHeaderRow = { borderBottom: '3px solid #e2e8f0' };
export const tableHead = { padding: '16px 12px', color: '#475569', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.5px' };
export const tableRow = { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' };
export const tableData = { padding: '20px 12px', color: '#1e293b', fontSize: '16px', fontWeight: '500' };

// STATUS
export const statusOrange = { background: '#ffedd5', color: '#ea580c', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
export const statusRed = { background: '#fee2e2', color: '#e11d48', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
export const statusGreen = { background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };

export const statusOrangeText = {
  color: '#ea580c',
  fontSize: '15px',
  fontWeight: 'bold'
};

export const statusGreenText = {
  color: '#16a34a',
  fontSize: '15px',
  fontWeight: 'bold'
};

export const paidBadge = {
  border: '2px solid #16a34a',
  color: '#16a34a',
  padding: '8px 24px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'inline-block',
  textAlign: 'center'
};

export const markPaidBtn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '8px',
  background: '#16a34a',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer'
};

export const cancelBtnStyle = {
  padding: '10px 16px',
  background: '#fee2e2',
  color: '#991b1b',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: '0.2s'
};

export const messageStyle = {
  padding: '18px',
  borderRadius: '12px',
  fontWeight: 'bold',
  marginBottom: '30px',
  fontSize: '16px'
};

export const emptyText = {
  color: '#64748b',
  fontSize: '16px',
  padding: '40px 0',
  textAlign: 'center'
};