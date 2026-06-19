import React from "react";

export default function AppointmentsTable({
  filteredAppts,
  updateAppointmentStatus,
  tableStyle,
  tableHeaderRow,
  tableHead,
  tableRow,
  tableData,
  statusGreen,
  statusRed,
  statusOrange,
  cancelBtnStyle,
  emptyText,
}) {
  return filteredAppts.length > 0 ? (
    <table style={tableStyle}>
      <thead>
        <tr style={tableHeaderRow}>
          <th style={tableHead}>Appt ID</th>
          <th style={tableHead}>Patient</th>
          <th style={tableHead}>Doctor</th>
          <th style={tableHead}>Date</th>
          <th style={tableHead}>Status</th>
          <th style={tableHead}>Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredAppts.map((a, i) => {
          const stat = (
            a.status || "Pending"
          ).toLowerCase();

          const badgeStyle =
            stat === "completed"
              ? statusGreen
              : stat === "cancelled"
              ? statusRed
              : statusOrange;

          return (
            <tr key={i} style={tableRow}>
              <td
                style={{
                  ...tableData,
                  color: "#0284c7",
                }}
              >
                #{a.appointment_id || a.id}
              </td>

              <td
                style={{
                  ...tableData,
                  fontWeight: "bold",
                }}
              >
                {a.patient_name}
              </td>

              <td style={tableData}>
                {a.doctor_name ||
                  "Specialist"}
              </td>

              <td style={tableData}>
                {new Date(
                  a.date
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </td>

              <td style={tableData}>
                <span style={badgeStyle}>
                  {a.status || "Pending"}
                </span>
              </td>

              <td style={tableData}>
                {stat !== "completed" &&
                stat !== "cancelled" ? (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        a.appointment_id ||
                          a.id,
                        "Cancelled"
                      )
                    }
                    style={cancelBtnStyle}
                  >
                    Cancel
                  </button>
                ) : (
                  <span
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    -
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <p style={emptyText}>
      No appointments found.
    </p>
  );
}