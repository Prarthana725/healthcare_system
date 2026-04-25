import { useEffect, useState } from "react";

function App() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/medicines")
      .then(res => res.json())
      .then(data => setMedicines(data));
  }, []);

  return (
    <div>
      <h1>Medicines</h1>
      <ul>
        {medicines.map(med => (
          <li key={med.medicine_id}>
            {med.name} - {med.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;