import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PharmacistDashboard() {

    const [medicines, setMedicines] = useState([]);

    const [form, setForm] = useState({
        name: '',
        quantity: ''
    });

    const [message, setMessage] = useState('');

    // LOAD DATA
    useEffect(() => {
        loadMedicines();
    }, []);

    async function loadMedicines() {
        try {
            const response = await fetch(`${API_URL}/medicines`);
            const data = await response.json();

            setMedicines(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    }

    // ADD MEDICINE
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name,
                    quantity: Number(form.quantity)
                })
            });

            if (response.ok) {
                setMessage('Medicine added successfully ✅');

                setForm({
                    name: '',
                    quantity: ''
                });

                loadMedicines();

            } else {
                setMessage('Failed to add medicine ❌');
            }

        } catch (error) {
            setMessage('Server error ❌');
        }
    }

    // UPDATE STOCK
    async function updateStock(id, currentQty) {

        const newQty = prompt('Enter new stock quantity:', currentQty);

        if (newQty === null) return;

        try {

            const medicine = medicines.find(m => m.medicine_id === id);

            const response = await fetch(`${API_URL}/medicines/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: medicine.name,
                    quantity: Number(newQty)
                })
            });

            if (response.ok) {
                setMessage('Stock updated successfully ✅');
                loadMedicines();
            } else {
                setMessage('Failed to update stock ❌');
            }

        } catch (error) {
            setMessage('Server error ❌');
        }
    }

    // LOW STOCK FILTER
    const lowStockMedicines = medicines.filter(
        med => Number(med.quantity) < 10
    );

    return (
        <div className="page-content">

            <h1>💊 Pharmacist Dashboard</h1>
            <p>Medicine inventory & stock management system</p>

            {/* MESSAGE */}
            {message && (
                <p className="small-note">{message}</p>
            )}

            {/* DASHBOARD CARDS */}
            <div className="card-grid">

                <div className="card">
                    <div className="card-title">
                        Total Medicines
                    </div>

                    <div className="card-value">
                        {medicines.length}
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">
                        Low Stock Alerts
                    </div>

                    <div className="card-value">
                        {lowStockMedicines.length}
                    </div>
                </div>

            </div>

            {/* ADD MEDICINE */}
            <div className="form-panel">

                <h3>➕ Add New Medicine</h3>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Medicine Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                quantity: e.target.value
                            })
                        }
                        required
                    />

                    <button type="submit">
                        Add Medicine
                    </button>

                </form>

            </div>

            {/* LOW STOCK ALERT */}
            <div className="table-panel">

                <h3>⚠️ Low Stock Alerts</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Medicine</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>

                    <tbody>

                        {lowStockMedicines.length > 0 ? (

                            lowStockMedicines.map((med) => (

                                <tr key={med.medicine_id}>

                                    <td>{med.name}</td>

                                    <td className="low-stock">
                                        {med.quantity}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td colSpan="2">
                                    No low stock medicines ✅
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* INVENTORY TABLE */}
            <div className="table-panel">

                <h3>📦 Medicine Inventory</h3>

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Medicine</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {medicines.map((med) => {

                            const lowStock =
                                Number(med.quantity) < 10;

                            return (

                                <tr key={med.medicine_id}>

                                    <td>{med.medicine_id}</td>

                                    <td>{med.name}</td>

                                    <td
                                        className={
                                            lowStock
                                                ? 'low-stock'
                                                : ''
                                        }
                                    >
                                        {med.quantity}
                                    </td>

                                    <td>
                                        {lowStock
                                            ? '⚠️ Low Stock'
                                            : '✅ Available'}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                updateStock(
                                                    med.medicine_id,
                                                    med.quantity
                                                )
                                            }
                                        >
                                            Update Stock
                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
}