import React from "react";

export default function InvoiceModal({
  showInvoice,
  selectedBill,
  setShowInvoice,
  paymentMethods,
  setPaymentMethods,
  paymentAmounts,
  setPaymentAmounts,
  markAsPaid
}) {

  if (!showInvoice || !selectedBill) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "450px",
        height: "100vh",
        background: "#f8fafc",
        boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "25px",
        borderLeft: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontWeight: "800",
          }}
        >
          💳 Payment Details
        </h2>

        <button
          onClick={() => setShowInvoice(false)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "24px",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <span
          style={{
            background:
              (selectedBill.status || "").toLowerCase() === "paid"
                ? "#dcfce7"
                : "#fef3c7",
            color:
              (selectedBill.status || "").toLowerCase() === "paid"
                ? "#16a34a"
                : "#d97706",
            padding: "8px 14px",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          {(selectedBill.status || "").toLowerCase() === "paid"
            ? "Paid"
            : "Pending Payment"}
        </span>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: "22px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <p><strong>Invoice ID:</strong> INV-{selectedBill.bill_id}</p>
        <p><strong>Patient:</strong> {selectedBill.patient_name}</p>
        <p><strong>Doctor:</strong> {selectedBill.doctor_name}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(selectedBill.bill_date).toLocaleDateString()}
        </p>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
          padding: "25px",
          borderRadius: "16px",
          border: "1px solid #bfdbfe",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#2563eb",
            fontSize: "42px",
            fontWeight: "900",
          }}
        >
          Rs. {selectedBill.total_amount}
        </h1>

        <small
          style={{
            color: "#475569",
            fontWeight: "600",
          }}
        >
          Total Amount
        </small>
      </div>

      <label style={{ fontWeight: "600", color: "#334155" }}>
        Payment Method
      </label>

      <select
        value={paymentMethods[selectedBill.bill_id] || "Cash"}
        onChange={(e) =>
          setPaymentMethods({
            ...paymentMethods,
            [selectedBill.bill_id]: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "15px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          background: "#fff",
        }}
      >
        <option>Cash</option>
        <option>Card</option>
        <option>Insurance</option>
        <option>Online</option>
      </select>

      <label style={{ fontWeight: "600", color: "#334155" }}>
        Amount Received
      </label>

      <input
        type="number"
        placeholder="Enter amount"
        value={paymentAmounts[selectedBill.bill_id] || ""}
        onChange={(e) =>
          setPaymentAmounts({
            ...paymentAmounts,
            [selectedBill.bill_id]: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          background: "#fff",
        }}
      />

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <p><strong>Consultation Fee:</strong> Rs. {selectedBill.subtotal || 0}</p>
        <p><strong>Tax:</strong> Rs. {selectedBill.tax || 0}</p>

        <hr />

        <p><strong>Paid:</strong> Rs. {selectedBill.paid_amount || 0}</p>

        <p>
          <strong>Balance:</strong> Rs.{" "}
          {selectedBill.balance_amount || selectedBill.total_amount}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                (selectedBill.status || "").toLowerCase() === "paid"
                  ? "#16a34a"
                  : "#ea580c",
              fontWeight: "bold",
            }}
          >
            {selectedBill.status}
          </span>
        </p>
      </div>

      {(selectedBill.status || "").toLowerCase() !== "paid" && (
        <button
          onClick={() => markAsPaid(selectedBill.bill_id)}
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "16px",
            background: "linear-gradient(to right,#16a34a,#22c55e)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(34,197,94,0.25)",
          }}
        >
          ✓ Confirm Payment
        </button>
      )}
    </div>
  );
}