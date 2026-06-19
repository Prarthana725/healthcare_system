import React from "react";

export default function PatientTable({
  filteredPatients,
  editPatient,
  deactivatePatient,
  tableStyle,
  tableHeaderRow,
  tableHead,
  tableRow,
  tableData,
  emptyText,
}) {
  return filteredPatients.length > 0 ? (
    <table style={tableStyle}>
      <thead>
        <tr style={tableHeaderRow}>
          <th style={tableHead}>Patient ID</th>
          <th style={tableHead}>Name</th>
          <th style={tableHead}>Age</th>
          <th style={tableHead}>Phone</th>
          <th style={tableHead}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredPatients.map((p, i) => (
          <tr key={i} style={tableRow}>
            <td
              style={{
                ...tableData,
                color: "#0284c7",
              }}
            >
              #{p.patient_id || p.id}
            </td>

            <td
              style={{
                ...tableData,
                fontWeight: "bold",
              }}
            >
              {p.name}
            </td>

            <td style={tableData}>
              {p.age} Yrs
            </td>

            <td style={tableData}>
              {p.phone || "N/A"}
            </td>

            <td style={tableData}>
              <button
                onClick={() =>
                  editPatient(p)
                }
                style={{
                  background: "#0284c7",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                Update
              </button>

              <button
                onClick={() =>
                  deactivatePatient(
                    p.patient_id || p.id
                  )
                }
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Deactivate
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={emptyText}>
      No patients found matching your search.
    </p>
  );
}