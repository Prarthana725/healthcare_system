const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "healthcare_db"
});

// Test route
app.get("/", (req, res) => {
    res.send("Backend running");
});

// Get medicines
app.get("/medicines", (req, res) => {
    db.query("SELECT * FROM medicines", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add medicine
app.post("/add-medicine", (req, res) => {
    const { name, quantity } = req.body;

    db.query(
        "INSERT INTO medicines (name, quantity) VALUES (?, ?)",
        [name, quantity],
        (err, result) => {
            if (err) throw err;
            res.send("Medicine added");
        }
    );
});

app.get("/appointments", (req, res) => {
    db.query(
        `SELECT p.name AS patient, d.name AS doctor, a.date
     FROM appointments a
     JOIN patients p ON a.patient_id = p.patient_id
     JOIN doctors d ON a.doctor_id = d.doctor_id`,
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});