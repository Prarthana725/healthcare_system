import React from "react";
import { CalendarDays, CreditCard } from "lucide-react";

export default function DashboardTables({
  appointments,
  bills,
  setActiveTab,
  setSelectedBill,
  setShowInvoice,

  panelCard,
  tableHeaderArea,
  panelHeader,
  panelTitle,
  viewAllBtn,

  tableStyle,
  tableHeaderRow,
  tableHead,
  tableRow,
  tableData,

  statusGreen,
  statusRed,
  statusOrange,

  paidBadge
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px", marginBottom: "40px" }}>
      
      {/* APPOINTMENTS CARD */}
      <div style={panelCard}>
        <div style={tableHeaderArea}>
          <div style={panelHeader}>
            <CalendarDays size={24} color="#0284c7" />
            <h2 style={panelTitle}>Appointments</h2>
          </div>

          <button
            onClick={() => setActiveTab("appointments")}
            style={viewAllBtn}
          >
            View All
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRow}>
                <th style={tableHead}>Patient</th>
                <th style={tableHead}>Doctor</th>
                <th style={tableHead}>Date</th>
                <th style={tableHead}>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.slice(0, 5).map((a, i) => {
                const stat = (a.status || "Pending").toLowerCase();

                const badgeStyle =
                  stat === "completed"
                    ? statusGreen
                    : stat === "cancelled"
                    ? statusRed
                    : statusOrange;

                return (
                  <tr key={i} style={tableRow}>
                    <td style={{ ...tableData, fontWeight: "bold" }}>
                      {a.patient_name}
                    </td>

                    <td style={tableData}>
                      {a.doctor_name || "Specialist"}
                    </td>

                    <td style={tableData}>
                      {new Date(a.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>

                    <td style={tableData}>
                      <span style={badgeStyle}>
                        {a.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILLS CARD */}
      <div style={panelCard}>
        <div style={tableHeaderArea}>
          <div style={panelHeader}>
            <CreditCard size={24} color="#0284c7" />
            <h2 style={panelTitle}>Bills</h2>
          </div>

          <button
            onClick={() => setActiveTab("bills")}
            style={viewAllBtn}
          >
            View All
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRow}>
                <th style={tableHead}>Patient</th>
                <th style={tableHead}>Doctor</th>
                <th style={tableHead}>Date</th>
                <th style={tableHead}>Amount</th>
                <th style={tableHead}>Status</th>
                <th style={tableHead}>Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.slice(0, 4).map((b, i) => {
                const isPaid =
                  (b.status || "").toLowerCase() === "paid";

                return (
                  <tr key={b.bill_id || i} style={tableRow}>
                    <td style={{ ...tableData, fontWeight: "bold" }}>
                      {b.patient_name}
                    </td>

                    <td style={tableData}>
                      {b.doctor_name || "Doctor"}
                    </td>

                    <td style={tableData}>
                      {new Date(
                        b.bill_date || b.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>

                    <td style={{ ...tableData, fontWeight: "bold" }}>
                      Rs. {b.total_amount || b.amount}
                    </td>

                    <td style={tableData}>
                      <span
                        style={{
                          background: isPaid
                            ? "#dcfce7"
                            : "#fef3c7",
                          color: isPaid
                            ? "#16a34a"
                            : "#d97706",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontWeight: "bold",
                          fontSize: "12px"
                        }}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td style={tableData}>
                      <button
                        onClick={() => {
                          setSelectedBill(b);
                          setShowInvoice(true);
                        }}
                        style={{
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "10px 16px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        👁 View Invoice
                      </button>
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