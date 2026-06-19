import React from 'react';
import {
    LayoutDashboard,
    CalendarDays,
    Plus,
    History,
    Users,
    CreditCard,
    LogOut,
    Building2
} from 'lucide-react';

export default function ReceptionistSidebar({
    activeTab,
    setActiveTab,
    logout,
    sidebarStyle,
    sidebarHeader,
    sidebarLogo,
    sidebarTitle,
    sidebarSub,
    sidebarNav,
    navItem,
    activeNavItem,
    sidebarProfileSection,
    profileInfo,
    profileAvatar,
    profileName,
    profileRole,
    sidebarLogoutBtn
}) {

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard size={22} />
        },
        {
            id: 'appointments',
            label: 'Appointments',
            icon: <CalendarDays size={22} />
        },
        {
            id: 'book', // FIXED
            label: 'Book Now',
            icon: <Plus size={22} />
        },
        {
            id: 'history',
            label: 'History',
            icon: <History size={22} />
        },
        {
            id: 'inactivePatients',
            label: 'Inactive Patients',
            icon: <Users size={22} />
        },
        {
            id: 'bills',
            label: 'Bills',
            icon: <CreditCard size={22} />
        }
    ];

    return (
        <div style={sidebarStyle}>

            <div style={sidebarHeader}>
                <div style={sidebarLogo}>
                    <Building2 size={26} color="white" />
                </div>

                <div>
                    <div style={sidebarTitle}>
                        Health Care Hospital
                    </div>

                    <div style={sidebarSub}>
                        Receptionist Portal
                    </div>
                </div>
            </div>

            <div style={sidebarNav}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        style={
                            activeTab === item.id
                                ? activeNavItem
                                : navItem
                        }
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        {item.label}
                    </div>
                ))}
            </div>

            <div style={sidebarProfileSection}>

                <div style={profileInfo}>
                    <div style={profileAvatar}>
                        👩‍💼
                    </div>

                    <div>
                        <div style={profileName}>
                            Receptionist
                        </div>

                        <div style={profileRole}>
                            Front Desk
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={sidebarLogoutBtn}
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </div>
    );
}