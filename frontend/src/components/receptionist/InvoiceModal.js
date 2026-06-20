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

  const status = (selectedBill.status || selectedBill.payment_status || "pending").toLowerCase();
  const isPaid = status === "paid";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "460px",
        height: "100vh",
        background: "#f1f5f9",
        boxShadow: "-16px 0 40px rgba(15, 23, 42, 0.18)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "28px",
        borderLeft: "1px solid #cbd5e1",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            MEDICARE HOSPITAL
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            Invoice
          </h2>
        </div>

        <button
          onClick={() => setShowInvoice(false)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "24px",
            cursor: "pointer",
            color: "#475569",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "24px 26px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "18px",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#475569",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
              }}
            >
              Invoice Number
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              INV-{selectedBill.bill_id}
            </p>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 14px",
              borderRadius: "999px",
              background: isPaid ? "#dcfce7" : "#fef3c7",
              color: isPaid ? "#15803d" : "#b45309",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {isPaid ? "Paid" : "Pending"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginTop: "24px",
          }}
        >
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Patient</p>
            <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              {selectedBill.patient_name}
            </p>
          </div>

          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Doctor</p>
            <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              {selectedBill.doctor_name}
            </p>
          </div>

          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Date</p>
            <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              {new Date(selectedBill.bill_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Status</p>
            <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              {selectedBill.status || selectedBill.payment_status || "Pending"}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "24px 26px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "0.02em",
          }}
        >
          Charges
        </h3>

        <div style={{ marginTop: "22px", display: "grid", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
            <span>Consultation Fee</span>
            <span>Rs. {selectedBill.consultation_fee || 0}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
            <span>Appointment Fee</span>
            <span>Rs. {selectedBill.appointment_fee || 0}</span>
          </div>

          <div style={{ paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: 700, color: "#0f172a" }}>
              <span>Medicine Charges</span>
              <span>Rs. {selectedBill.medicine_fee || 0}</span>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {(selectedBill.items || []).map((item, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.9fr 0.9fr 0.9fr", gap: "10px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{item.medicine_name}</span>
                  <span style={{ color: "#64748b" }}>Qty {item.quantity}</span>
                  <span style={{ color: "#64748b" }}>Rs. {item.unit_price}</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Rs. {item.item_total}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
            <span>Hospital Service Fee</span>
            <span>Rs. {selectedBill.service_fee || 0}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
            <span>Tax (5%)</span>
            <span>Rs. {selectedBill.tax || 0}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#2563eb",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "24px 26px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.85 }}>
          Total Amount
        </p>
        <p style={{ margin: "10px 0 0", fontSize: "36px", fontWeight: 900 }}>
          Rs. {selectedBill.total_amount || 0}
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "24px 26px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", color: "#475569" }}>
          <span>Paid Amount</span>
          <span>Rs. {selectedBill.paid_amount || 0}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
          <span>Balance Amount</span>
          <span>Rs. {selectedBill.balance_amount || selectedBill.total_amount || 0}</span>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: 600, color: "#334155" }}>Payment Method</label>
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
            padding: "14px",
            marginTop: "8px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#0f172a",
          }}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>Insurance</option>
          <option>Online</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontWeight: 600, color: "#334155" }}>Amount Received</label>
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
            padding: "14px",
            marginTop: "8px",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#0f172a",
          }}
        />
      </div>

      {!isPaid && (
        <button
          onClick={() => markAsPaid(selectedBill.bill_id)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            background: "linear-gradient(to right,#16a34a,#22c55e)",
            color: "#ffffff",
            border: "none",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(16, 185, 129, 0.22)",
          }}
        >
          Confirm Payment
        </button>
      )}
    </div>
  );
}
