import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PharmacistDashboard() {

    const [medicines, setMedicines] = useState([]);

    const [prescriptions,
        setPrescriptions] =
        useState([]);

    const [form, setForm] = useState({

        name: '',

        quantity: '',

        price: ''
    });

    const [message, setMessage] =
        useState('');

    // LOAD DATA
    useEffect(() => {

        loadMedicines();

        loadPrescriptions();

    }, []);

    async function loadMedicines() {

        try {

            const response =
                await fetch(
                    `${API_URL}/medicines`
                );

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

    // LOAD PRESCRIPTIONS
    async function loadPrescriptions() {

        try {

            const response =
                await fetch(
                    `${API_URL}/prescriptions`
                );

            const data =
                await response.json();

            setPrescriptions(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);
        }
    }

    // ADD MEDICINE
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

                            name:
                                form.name,

                            quantity:
                                Number(form.quantity),

                            price:
                                Number(form.price)
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

    // UPDATE STOCK
    async function updateStock(
        id,
        currentQty
    ) {

        const newQty =
            prompt(
                'Enter new stock quantity:',
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

                            name:
                                medicine.name,

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

    // ISSUE MEDICINE
    async function issueMedicine(
        prescriptionId
    ) {

        try {

            //--------------------------------------------------
            // REMOVE PRESCRIPTION FROM UI
            //--------------------------------------------------

            setPrescriptions(

                prescriptions.filter(

                    p =>

                        p.prescription_id !==
                        prescriptionId
                )
            );

            //--------------------------------------------------
            // RELOAD MEDICINES
            //--------------------------------------------------

            await loadMedicines();

            //--------------------------------------------------
            // SUCCESS MESSAGE
            //--------------------------------------------------

            setMessage(

                `Prescription #${prescriptionId}
                 issued successfully ✅`
            );

        } catch (error) {

            console.error(error);

            setMessage(
                'Failed to issue medicine ❌'
            );
        }
    }

    // LOW STOCK
    const lowStockMedicines =
        medicines.filter(

            med =>
                Number(med.quantity) < 10
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

                    marginBottom: '30px',

                    boxShadow:
                        '0 10px 30px rgba(0,0,0,0.1)'
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
                        opacity: 0.9,
                        fontSize: '16px'
                    }}
                >
                    Pharmacy inventory & billing workflow
                </p>

            </div>

            {/* MESSAGE */}

            {message && (

                <div
                    style={{
                        background: '#ecfeff',
                        color: '#0f766e',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '25px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}
                >
                    {message}
                </div>

            )}

            {/* DASHBOARD */}

            <div
                style={{
                    display: 'grid',

                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(240px, 1fr))',

                    gap: '20px',

                    marginBottom: '30px'
                }}
            >

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📦 Total Medicines
                    </div>

                    <div style={cardValue}>
                        {medicines.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        ⚠️ Low Stock Alerts
                    </div>

                    <div
                        style={{
                            ...cardValue,

                            color:
                                lowStockMedicines.length > 0
                                    ? '#dc2626'
                                    : '#16a34a'
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

            </div>

            {/* MAIN GRID */}

            <div
                style={{
                    display: 'grid',

                    gridTemplateColumns:
                        '1fr 1.6fr',

                    gap: '25px',

                    marginBottom: '30px'
                }}
            >

                {/* ADD MEDICINE */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        ➕ Add Medicine
                    </h2>

                    <form
                        onSubmit={handleSubmit}

                        style={{
                            display: 'flex',
                            flexDirection:
                                'column',
                            gap: '18px'
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Medicine Name"
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
                            type="number"
                            placeholder="Quantity"
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
                            type="submit"
                            style={buttonStyle}
                        >
                            Add Medicine
                        </button>

                    </form>

                </div>

                {/* LOW STOCK */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        ⚠️ Low Stock Alerts
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

                            </tr>

                        </thead>

                        <tbody>

                            {lowStockMedicines.length > 0 ? (

                                lowStockMedicines.map((med) => (

                                    <tr
                                        key={
                                            med.medicine_id
                                        }
                                    >

                                        <td style={tableData}>
                                            {med.name}
                                        </td>

                                        <td
                                            style={{
                                                ...tableData,
                                                color:
                                                    '#dc2626',
                                                fontWeight:
                                                    '700'
                                            }}
                                        >
                                            {med.quantity}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="2"
                                        style={emptyStyle}
                                    >
                                        No low stock medicines ✅
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* PRESCRIPTIONS */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    💊 Pending Prescriptions
                </h2>

                <div style={{ overflowX: 'auto' }}>

                    <table style={tableStyle}>

                        <thead>

                            <tr style={tableHeaderRow}>

                                <th style={tableHead}>
                                    Patient
                                </th>

                                <th style={tableHead}>
                                    Doctor
                                </th>

                                <th style={tableHead}>
                                    Medicines
                                </th>

                                <th style={tableHead}>
                                    Total
                                </th>

                                <th style={tableHead}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {prescriptions.map((p) => {

                                let total = 0;

                                p.details?.forEach(d => {

                                    const med =
                                        medicines.find(

                                            m =>
                                                m.medicine_id ===
                                                d.medicine_id
                                        );

                                    if (med) {

                                        total +=

                                            (
                                                med.price *
                                                d.quantity
                                            );
                                    }
                                });

                                return (

                                    <tr
                                        key={
                                            p.prescription_id
                                        }
                                    >

                                        <td style={tableData}>
                                            {
                                                p.patient_name
                                            }
                                        </td>

                                        <td style={tableData}>
                                            {
                                                p.doctor_name
                                            }
                                        </td>

                                        <td style={tableData}>

                                            {
                                                p.details
                                                    ?.map(d =>

                                                        `${d.medicine_name}
                                                         (${d.quantity})`
                                                    )

                                                    .join(', ')
                                            }

                                        </td>

                                        <td
                                            style={{
                                                ...tableData,

                                                fontWeight:
                                                    '700',

                                                color:
                                                    '#0284c7'
                                            }}
                                        >
                                            Rs. {total}
                                        </td>

                                        <td style={tableData}>

                                            <button

                                                onClick={() =>

                                                    issueMedicine(
                                                        p.prescription_id
                                                    )

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

                </div>

            </div>

            {/* INVENTORY */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    📦 Medicine Inventory
                </h2>

                <div style={{ overflowX: 'auto' }}>

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
                                    Status
                                </th>

                                <th style={tableHead}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {medicines.map((med) => {

                                const lowStock =
                                    Number(med.quantity) < 10;

                                return (

                                    <tr
                                        key={
                                            med.medicine_id
                                        }
                                    >

                                        <td style={tableData}>
                                            {
                                                med.medicine_id
                                            }
                                        </td>

                                        <td style={tableData}>
                                            {med.name}
                                        </td>

                                        <td
                                            style={{
                                                ...tableData,

                                                color:
                                                    lowStock
                                                        ? '#dc2626'
                                                        : '#16a34a',

                                                fontWeight:
                                                    '700'
                                            }}
                                        >
                                            {med.quantity}
                                        </td>

                                        <td style={tableData}>
                                            Rs. {med.price}
                                        </td>

                                        <td style={tableData}>

                                            {lowStock
                                                ? '⚠️ Low Stock'
                                                : '✅ Available'}

                                        </td>

                                        <td style={tableData}>

                                            <button
                                                onClick={() =>

                                                    updateStock(

                                                        med.medicine_id,

                                                        med.quantity
                                                    )

                                                }

                                                style={updateBtnStyle}
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

        </div>
    );
}

/* STYLES */

const cardStyle = {

    background: 'white',

    borderRadius: '20px',

    padding: '25px',

    boxShadow:
        '0 5px 20px rgba(0,0,0,0.06)'
};

const cardTitle = {

    color: '#64748b',

    fontSize: '16px',

    marginBottom: '15px'
};

const cardValue = {

    fontSize: '42px',

    fontWeight: '700',

    color: '#0f172a'
};

const panelStyle = {

    background: 'white',

    borderRadius: '20px',

    padding: '30px',

    boxShadow:
        '0 5px 20px rgba(0,0,0,0.06)'
};

const sectionTitle = {

    marginBottom: '25px',

    color: '#0f172a'
};

const inputStyle = {

    width: '100%',

    padding: '14px',

    borderRadius: '12px',

    border:
        '1px solid #cbd5e1',

    background: '#f8fafc',

    fontSize: '15px',

    outline: 'none',

    boxSizing: 'border-box'
};

const buttonStyle = {

    padding: '15px',

    border: 'none',

    borderRadius: '12px',

    background:
        'linear-gradient(to right, #0f766e, #0284c7)',

    color: 'white',

    fontSize: '15px',

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

    textAlign: 'left',

    color: '#334155',

    fontSize: '15px'
};

const tableData = {

    padding: '16px',

    borderBottom:
        '1px solid #e2e8f0',

    color: '#0f172a'
};

const emptyStyle = {

    padding: '20px',

    textAlign: 'center',

    color: '#64748b'
};