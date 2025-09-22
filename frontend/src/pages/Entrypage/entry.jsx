import { useState, useEffect } from "react";
import Alert from "../../components/UI/Alert";
import axios from "axios";

export default function Entry() {
  const [name, setName] = useState("");
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!name) {
      setStatus({ type: 'failure', message: 'Please enter a name' });
      return;
    }
    const res = await axios.post("http://localhost:3000/api/entries", { name });
    setEntries([res.data, ...entries]);
    setName("");
    setStatus({ type: 'success', message: 'Added successfully' });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/entries").then(res => {
      setEntries(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Entry Form</h2>
      {status && (
        <div style={{ marginBottom: 12 }}>
          <Alert type={status.type} message={status.message} />
        </div>
      )}
      <input
        type="text"
        value={name}
        placeholder="Enter a name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>

      <h3>Entries</h3>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>{e.name} ({new Date(e.created_at).toLocaleString()})</li>
        ))}
      </ul>
    </div>
  );
}
