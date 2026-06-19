import React from "react";
import {
  Users,
  CalendarDays,
  Calendar,
  Hourglass,
  Wallet
} from "lucide-react";

export default function DashboardStats({
  patients,
  appointments,
  todayAppointments,
  pendingBills,
  totalRevenue,
  statsGrid,
  statCard,
  statTopRow,
  iconBox,
  trendBadge,
  statValue,
  statLabel,
}) {
  return (
    <div style={statsGrid}>
      <div style={statCard}>
        <div style={statTopRow}>
          <div style={{ ...iconBox, background: "#f3e8ff", color: "#9333ea" }}>
            <Users size={28} />
          </div>
          <span style={{ ...trendBadge, color: "#9333ea", background: "#f3e8ff" }}>
            ↑ 12%
          </span>
        </div>
        <div style={statValue}>{patients.length}</div>
        <div style={statLabel}>Total Patients</div>
      </div>

      <div style={statCard}>
        <div style={statTopRow}>
          <div style={{ ...iconBox, background: "#e0f2fe", color: "#0284c7" }}>
            <CalendarDays size={28} />
          </div>
          <span style={{ ...trendBadge, color: "#0284c7", background: "#e0f2fe" }}>
            ↑ 8%
          </span>
        </div>
        <div style={statValue}>{appointments.length}</div>
        <div style={statLabel}>Total Appointments</div>
      </div>

      <div style={statCard}>
        <div style={statTopRow}>
          <div style={{ ...iconBox, background: "#dcfce7", color: "#16a34a" }}>
            <Calendar size={28} />
          </div>
          <span style={{ ...trendBadge, color: "#64748b", background: "#f1f5f9" }}>
            -
          </span>
        </div>
        <div style={statValue}>{todayAppointments}</div>
        <div style={statLabel}>Today's Appointments</div>
      </div>

      <div style={statCard}>
        <div style={statTopRow}>
          <div style={{ ...iconBox, background: "#ffedd5", color: "#ea580c" }}>
            <Hourglass size={28} />
          </div>
          <span style={{ ...trendBadge, color: "#ea580c", background: "#ffedd5" }}>
            ↑ 15%
          </span>
        </div>
        <div style={statValue}>{pendingBills}</div>
        <div style={statLabel}>Pending Payments</div>
      </div>

      <div style={statCard}>
        <div style={statTopRow}>
          <div style={{ ...iconBox, background: "#ffe4e6", color: "#e11d48" }}>
            <Wallet size={28} />
          </div>
          <span style={{ ...trendBadge, color: "#e11d48", background: "#ffe4e6" }}>
            ↑ 10%
          </span>
        </div>
        <div style={statValue}>Rs. {totalRevenue}</div>
        <div style={statLabel}>Total Revenue</div>
      </div>
    </div>
  );
}