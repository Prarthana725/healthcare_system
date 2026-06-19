import React from "react";

export default function InactivePatientsTable({
  inactivePatients,
  restorePatient,
  tableStyle,
  tableHeaderRow,
  tableHead,
  tableRow,
  tableData,
  emptyText,
}) {
  if (inactivePatients.length === 0) {
    return (
      <p style={emptyText}>
        No inactive patients found.
      </p>
    );
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr style={tableHeaderRow}>
          <th style={tableHead}>Patient ID</th>
          <th style={tableHead}>Name</th>
          <th style={tableHead}>Age</th>
          <th style={tableHead}>Phone</th>
          <th style={tableHead}>Status</th>
          <th style={tableHead}>Action</th>
        </tr>
      </thead>

      <tbody>
        {inactivePatients.map((p) => (
          <tr
            key={p.patient_id}
            style={tableRow}
          >
            <td style={tableData}>
              #{p.patient_id}
            </td>

            <td style={tableData}>
              {p.name}
            </td>

            <td style={tableData}>
              {p.age}
            </td>

            <td style={tableData}>
              {p.phone}
            </td>

            <td style={tableData}>
              <span
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                }}
              >
                Inactive
              </span>
            </td>

            <td style={tableData}>
              <button
                onClick={() =>
                  restorePatient(
                    p.patient_id
                  )
                }
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Restore
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}