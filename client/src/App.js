import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(response.data.transactions || []);
      } catch (error) {
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) =>
      tx.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.name && tx.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, transactions]);

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <h1>Hedera Transactions</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <FaSun color="gold" size={20} /> : <FaMoon color="black" size={20} />}
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading Transactions...</p>
        </div>
      ) : (
        <div className="table-container">
          {filteredTransactions.length > 0 ? (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Consensus Timestamp</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.transaction_id || "N/A"}</td>
                    <td>{tx.consensus_timestamp || "N/A"}</td>
                    <td>{tx.name || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No relevant transactions found.</p>
          )}
        </div>
      )}

      <style>{`
        .app-container {
          font-family: 'Poppins', sans-serif;
          text-align: center;
          padding: 20px;
          min-height: 100vh;
          transition: background 0.3s, color 0.3s;
        }
        .dark {
          background: #121212;
          color: white;
        }
        .light {
          background: #f4f4f4;
          color: black;
        }
        .header {
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 15px;
        }
        .search-input {
          width: 60%;
          padding: 12px;
          border-radius: 25px;
          border: none;
          outline: none;
          font-size: 16px;
          text-align: center;
        }
        .theme-toggle {
          cursor: pointer;
          background: transparent;
          border: none;
          font-size: 18px;
          padding: 10px;
        }
        .table-container {
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
        }
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .transaction-table th, .transaction-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .transaction-table tr:hover {
          background-color: rgba(0,0,0,0.1);
        }
        .error {
          color: red;
          font-size: 16px;
          margin-top: 10px;
        }
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          font-size: 18px;
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-left-color: #ffcc00;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
