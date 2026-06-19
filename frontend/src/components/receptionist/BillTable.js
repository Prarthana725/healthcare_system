import React from "react";

export default function BillTable({
  filteredBills,
  setSelectedBill,
  setShowInvoice,
  markAsPaid,
  tableStyle,
  tableHeaderRow,
  tableHead,
  tableRow,
  tableData,
  statusGreenText,
  statusOrangeText,
  paidBadge,
  markPaidBtn,
}) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={tableHeaderRow}>
          <th style={tableHead}>Invoice ID</th>
          <th style={tableHead}>Patient</th>
          <th style={tableHead}>Doctor</th>
          <th style={tableHead}>Date</th>
          <th style={tableHead}>Amount</th>
          <th style={tableHead}>Status</th>
          <th style={tableHead}>Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredBills.map((b, i) => {
          const isPaid =
            (b.status || "").toLowerCase() === "paid";

          return (
            <tr key={b.bill_id || i} style={tableRow}>
              <td
                style={{
                  ...tableData,
                  color: "#0284c7",
                  fontWeight: "bold",
                }}
              >
                #INV-{b.bill_id || b.id || i + 1000}
              </td>

              <td
                style={{
                  ...tableData,
                  fontWeight: "bold",
                }}
              >
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
                  year: "numeric",
                })}
              </td>

              <td
                style={{
                  ...tableData,
                  fontWeight: "bold",
                }}
              >
                Rs. {b.total_amount || b.amount}
              </td>

              <td style={tableData}>
                <span
                  style={
                    isPaid
                      ? statusGreenText
                      : statusOrangeText
                  }
                >
                  {b.status || "Pending"}
                </span>
              </td>

              <td style={tableData}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: "140px",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedBill(b);
                      setShowInvoice(true);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    👁 View Invoice
                  </button>

                  {!isPaid && (
                    <button
                      onClick={() =>
                        markAsPaid(
                          b.bill_id || b.id
                        )
                      }
                      style={markPaidBtn}
                    >
                      💳 Pay Now
                    </button>
                  )}

                  {isPaid && (
                    <span style={paidBadge}>
                      ✅ Paid
                    </span>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}