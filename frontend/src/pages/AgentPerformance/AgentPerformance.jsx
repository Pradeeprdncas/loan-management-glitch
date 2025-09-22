// /src/pages/AgentPerformance.jsx
import React from "react";

const AgentPerformance = () => {
  // Sample data (later you can fetch from backend API)
  const agents = [
    { id: 1, name: "John Doe", loansHandled: 25, successRate: "92%" },
    { id: 2, name: "Jane Smith", loansHandled: 18, successRate: "88%" },
    { id: 3, name: "Mike Johnson", loansHandled: 30, successRate: "95%" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agent Performance</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Agent Name</th>
            <th style={thStyle}>Loans Handled</th>
            <th style={thStyle}>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td style={tdStyle}>{agent.id}</td>
              <td style={tdStyle}>{agent.name}</td>
              <td style={tdStyle}>{agent.loansHandled}</td>
              <td style={tdStyle}>{agent.successRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reusable styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default AgentPerformance;
