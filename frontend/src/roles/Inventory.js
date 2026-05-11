import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PharmacistDashboard() {

    const [medicines, setMedicines] = useState([]);
    const [usageData, setUsageData] = useState([]);
    const [issueHistory, setIssueHistory] = useState([]);
    const [search, setSearch] = useState('');

    const filteredMedicines =
        usageData.filter(med =>

            med.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );

    const [prescriptions,
        setPrescriptions] =
        useState([]);

    const [form, setForm] = useState({

        name: '',
        quantity: '',
        price: ''
    });

    const [issueForm, setIssueForm] = useState({
        medicine_id: '',
        quantity: ''
    });

    const [message, setMessage] =
        useState('');

    //---------------------------------------------
    // LOAD DATA
    //---------------------------------------------

    useEffect(() => {

        loadMedicines();
        loadUsage();
        loadIssueHistory();
    }, []);

    async function loadMedicines() {

        try {

            const response =
                await fetch(`${API_URL}/medicines`);

            const data =
                await response.json();

            setMedicines(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

        }
    }


    //---------------------------------------------
    // DELETE MEDICINE
    //---------------------------------------------

    async function deleteMedicine(id) {

        const confirmDelete =
            window.confirm(
                'Delete this medicine?'
            );

        if (!confirmDelete) return;

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines/${id}`,
                    {
                        method: 'DELETE'
                    }
                );

            if (response.ok) {

                setMessage(
                    'Medicine deleted successfully ✅'
                );

                loadMedicines();
                loadUsage();

            } else {

                setMessage(
                    'Failed to delete medicine ❌'
                );

            }

        } catch (error) {

            setMessage(
                'Server error ❌'
            );

        }
    }

    //---------------------------------------------
    // LOAD ISSUE HISTORY
    //---------------------------------------------

    async function loadIssueHistory() {

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines/issue-history`
                );

            const data =
                await response.json();

            setIssueHistory(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

        }
    }
    //---------------------------------------------
    // LOAD ANALYTICS
    //---------------------------------------------

    async function loadUsage() {

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines/with-usage`
                );

            const data =
                await response.json();

            setUsageData(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

        }
    }

    //---------------------------------------------
    // ADD MEDICINE
    //---------------------------------------------

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            name: form.name,
                            quantity: Number(
                                form.quantity
                            ),
                            price: Number(
                                form.price
                            )
                        })
                    }
                );

            if (response.ok) {

                setMessage(
                    'Medicine added successfully ✅'
                );

                setForm({

                    name: '',
                    quantity: '',
                    price: ''
                });

                loadMedicines();

            } else {

                setMessage(
                    'Failed to add medicine ❌'
                );

            }

        } catch (error) {

            setMessage(
                'Server error ❌'
            );

        }
    }

    //---------------------------------------------
    // UPDATE STOCK
    //---------------------------------------------

    async function updateStock(
        id,
        currentQty
    ) {

        const newQty =
            prompt(
                'Enter new quantity:',
                currentQty
            );

        if (newQty === null)
            return;

        try {

            const medicine =
                medicines.find(
                    m =>
                        m.medicine_id === id
                );

            const response =
                await fetch(
                    `${API_URL}/medicines/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            name: medicine.name,
                            quantity:
                                Number(newQty),
                            price:
                                medicine.price
                        })
                    }
                );

            if (response.ok) {

                setMessage(
                    'Stock updated successfully ✅'
                );

                loadMedicines();

            } else {

                setMessage(
                    'Failed to update stock ❌'
                );

            }

        } catch (error) {

            setMessage(
                'Server error ❌'
            );

        }
    }

    //---------------------------------------------
    // ISSUE MEDICINE
    //---------------------------------------------

    async function issueMedicine(e) {

        e.preventDefault();

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines/reduce-stock`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            medicine_id:
                                issueForm.medicine_id,
                            quantity:
                                Number(
                                    issueForm.quantity
                                )
                        })
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                setMessage(
                    'Medicine issued successfully ✅'
                );

                setIssueForm({
                    medicine_id: '',
                    quantity: ''
                });

                loadMedicines();

            } else {

                setMessage(
                    data.error ||
                    'Failed ❌'
                );

            }

        } catch (error) {

            setMessage(
                'Server error ❌'
            );

        }
    }

    //---------------------------------------------
    // LOW STOCK
    //---------------------------------------------

    const lowStockMedicines =
        medicines.filter(
            med =>
                Number(med.quantity) < 10
        );

    //---------------------------------------------
    // TOTAL STOCK VALUE
    //---------------------------------------------

    const totalValue =
        medicines.reduce(
            (sum, med) =>
                sum +
                Number(med.quantity) *
                Number(med.price || 0),
            0
        );

    return (

        <div
            style={{
                minHeight: '100vh',
                background: '#f1f5f9',
                padding: '30px',
                fontFamily:
                    "'Segoe UI', sans-serif"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    background:
                        'linear-gradient(to right, #0f766e, #0284c7)',

                    borderRadius: '24px',

                    padding: '35px',

                    color: 'white',
                    marginBottom: '30px'
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: '34px'
                    }}
                >
                    💊 Pharmacist Dashboard
                </h1>

                <p
                    style={{
                        marginTop: '10px',
                        opacity: 0.9
                    }}
                >
                    Inventory & Medicine Control
                </p>

            </div>

            {/* MESSAGE */}

            {message && (

                <div
                    style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        fontWeight: '600'
                    }}
                >
                    {message}
                </div>

            )}

            {/* STATS */}

            <div
                style={{
                    display: 'grid',

                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',

                    marginBottom: '30px'
                }}
            >

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📦 Medicines
                    </div>

                    <div style={cardValue}>
                        {medicines.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        ⚠️ Low Stock
                    </div>

                    <div
                        style={{
                            ...cardValue,
                            color: '#dc2626'
                        }}
                    >
                        {lowStockMedicines.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        💊 Prescriptions
                    </div>

                    <div style={cardValue}>
                        {prescriptions.length}
                    </div>

                </div>

                <div style={cardStyle}>
                    <div style={cardTitle}>
                        💰 Inventory Value
                    </div>

                    <div style={cardValue}>
                        Rs. {totalValue}
                    </div>
                </div>

            </div>

            {/* FORMS */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        '1fr 1fr',
                    gap: '25px',

                    marginBottom: '30px'
                }}
            >

                {/* ADD */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        ➕ Add Medicine
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        style={formStyle}
                    >

                        <input
                            placeholder='Medicine Name'
                            value={form.name}

                            onChange={(e) =>

                                setForm({

                                    ...form,
                                    name:
                                        e.target.value
                                })

                            }

                            required

                            style={inputStyle}
                        />

                        <input
                            type='number'
                            placeholder='Quantity'
                            value={form.quantity}

                            onChange={(e) =>

                                setForm({

                                    ...form,
                                    quantity:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            type='number'
                            placeholder='Price'
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price:
                                        e.target.value
                                })

                            }

                            required

                            style={inputStyle}
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={form.price}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    price:
                                        e.target.value
                                })

                            }

                            required

                            style={inputStyle}
                        />

                        <button
                            type='submit'
                            style={buttonStyle}
                        >
                            Add Medicine
                        </button>

                    </form>

                </div>

                {/* ISSUE */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        💊 Issue Medicine
                    </h2>

                    <form
                        onSubmit={issueMedicine}
                        style={formStyle}
                    >

                        <select
                            value={
                                issueForm.medicine_id
                            }
                            onChange={(e) =>
                                setIssueForm({
                                    ...issueForm,
                                    medicine_id:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        >

                            <option value=''>
                                Select Medicine
                            </option>

                            {medicines.map(med => (

                                <option
                                    key={
                                        med.medicine_id
                                    }
                                    value={
                                        med.medicine_id
                                    }
                                >
                                    {med.name}
                                </option>

                            ))}

                        </select>

                        <input
                            type='number'
                            placeholder='Quantity'
                            value={
                                issueForm.quantity
                            }
                            onChange={(e) =>
                                setIssueForm({
                                    ...issueForm,
                                    quantity:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <button
                            type='submit'
                            style={buttonStyle}
                        >
                            Issue Medicine
                        </button>

                    </form>

                </div>

            </div>

            {/* LOW STOCK */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}
            >

                {lowStockMedicines.map(med => (

                    <div
                        key={med.medicine_id}
                        style={{
                            background: '#fee2e2',
                            padding: '20px',
                            borderRadius: '18px'
                        }}
                    >

                        <h3>{med.name}</h3>

                        <p>
                            Remaining:
                            <strong>
                                {' '}
                                {med.quantity}
                            </strong>
                        </p>

                                                }

                                                style={issueBtnStyle}
                                            >
                                                Issue Medicine
                                            </button>

                                        </td>

                                    </tr>

                                );
                            })}

                        </tbody>

                    </table>

                ))}

            </div>
            <input
                placeholder='Search medicine...'
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                style={{
                    ...inputStyle,
                    marginBottom: '20px',
                    width: '300px'
                }}
            />

            {/* INVENTORY TABLE */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    📦 Inventory Table
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>
                            <th style={tableHead}>
                                ID
                            </th>

                            <th style={tableHead}>
                                Medicine
                            </th>

                            <th style={tableHead}>
                                Quantity
                            </th>

                            <th style={tableHead}>
                                Price
                            </th>

                            <th style={tableHead}>
                                Used
                            </th>

                            <th style={tableHead}>
                                Action
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredMedicines.map(med => (

                            <tr
                                key={med.medicine_id}
                            >

                                <td style={tableData}>
                                    {med.medicine_id}
                                </td>

                                <td style={tableData}>
                                    {med.name}
                                </td>

                                <td style={tableData}>

                                    <span
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '30px',
                                            background:

                                                med.quantity < 10
                                                    ? '#fee2e2'
                                                    : '#dcfce7',

                                            color:

                                                med.quantity < 10
                                                    ? '#dc2626'
                                                    : '#166534',

                                            fontWeight: '600'
                                        }}
                                    >
                                        {med.quantity}
                                    </span>

                                </td>

                                <td style={tableData}>
                                    Rs.
                                    {med.price}
                                </td>

                                <td style={tableData}>
                                    {
                                        med.total_used
                                    }
                                </td>

                                <td style={tableData}>

                                    <button
                                        onClick={() =>
                                            updateStock(
                                                med.medicine_id,
                                                med.quantity
                                            )
                                        }
                                        style={{
                                            padding:
                                                '10px 14px',
                                            border:
                                                'none',
                                            borderRadius:
                                                '10px',
                                            background:
                                                '#0284c7',
                                            color:
                                                'white',
                                            cursor:
                                                'pointer'
                                        }}
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteMedicine(
                                                med.medicine_id
                                            )
                                        }
                                        style={{
                                            padding: '10px 14px',
                                            border: 'none',
                                            borderRadius: '10px',
                                            background: '#dc2626',
                                            color: 'white',
                                            cursor: 'pointer',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* ISSUE HISTORY */}

            <div
                style={{
                    ...panelStyle,
                    marginTop: '30px'
                }}
            >

                <h2 style={sectionTitle}>
                    📜 Medicine Issue History
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Medicine
                            </th>

                            <th style={tableHead}>
                                Quantity
                            </th>

                            <th style={tableHead}>
                                Issued Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {issueHistory.map(issue => (

                            <tr key={issue.issue_id}>

                                <td style={tableData}>
                                    {issue.name}
                                </td>

                                <td style={tableData}>
                                    {issue.quantity}
                                </td>

                                <td style={tableData}>
                                    {new Date(
                                        issue.issued_date
                                    ).toLocaleDateString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

/* STYLES */

const cardStyle = {

    background: 'white',

    borderRadius: '20px',
    padding: '25px'
};

const cardTitle = {

    color: '#64748b',
    marginBottom: '15px'
};

const cardValue = {
    fontSize: '38px',
    fontWeight: '700'
};

const panelStyle = {

    background: 'white',

    borderRadius: '20px',
    padding: '30px'
};

const sectionTitle = {
    marginBottom: '25px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
};

const inputStyle = {
    padding: '14px',

    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#f8fafc'
};

const buttonStyle = {
    padding: '14px',
    border: 'none',

    borderRadius: '12px',

    background:
        'linear-gradient(to right, #0f766e, #0284c7)',

    color: 'white',
    fontWeight: '700',

    cursor: 'pointer'
};

const issueBtnStyle = {

    padding:
        '10px 16px',

    border:
        'none',

    borderRadius:
        '10px',

    background:
        '#16a34a',

    color:
        'white',

    fontWeight:
        '700',

    cursor:
        'pointer'
};

const updateBtnStyle = {

    padding:
        '10px 16px',

    border:
        'none',

    borderRadius:
        '10px',

    background:
        '#0284c7',

    color:
        'white',

    fontWeight:
        '600',

    cursor:
        'pointer'
};

const tableStyle = {

    width: '100%',

    borderCollapse: 'collapse'
};

const tableHeaderRow = {

    background: '#f1f5f9'
};

const tableHead = {

    padding: '16px',
    textAlign: 'left'
};

const tableData = {

    padding: '16px',
    borderBottom: '1px solid #e2e8f0'
};