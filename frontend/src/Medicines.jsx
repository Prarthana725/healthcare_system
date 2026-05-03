import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadMedicines() {
      try {
        const response = await fetch(`${API_URL}/medicines`);
        const data = response.ok ? await response.json() : [];
        setMedicines(Array.isArray(data) ? data : []);
      } catch (error) {
        setMedicines([]);
      }
    }
    loadMedicines();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, quantity: Number(form.quantity) })
      });
      if (response.ok) {
        setMessage('Medicine added successfully.');
        setForm({ name: '', quantity: '' });
        const fresh = await (await fetch(`${API_URL}/medicines`)).json();
        setMedicines(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage('Unable to add medicine.');
      }
    } catch (error) {
      setMessage('Unable to add medicine.');
    }
  }

  return (
    <div className="page-content">
      <h2>Medicines</h2>
      <div className="form-panel">
        <h3>Add Medicine</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Medicine Name"
              required
            />
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Quantity"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p className="small-note">{message}</p>}
      </div>

      <div className="table-panel">
        <h3>Medicine Inventory</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => {
              const quantity = medicine.quantity ?? medicine.stock ?? 0;
              const low = Number(quantity) < 10;
              return (
                <tr key={medicine.medicine_id ?? medicine.id ?? index}>
                  <td>{medicine.name}</td>
                  <td className={low ? 'low-stock' : ''}>{quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Medicines;
