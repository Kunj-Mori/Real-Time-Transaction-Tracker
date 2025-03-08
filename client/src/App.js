import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaSun, FaMoon, FaWallet } from "react-icons/fa";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [accountId, setAccountId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error) {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsByAccount = async () => {
    const account = prompt("Enter your Hedera Account ID (0.0.xxxx):");
    if (!account) return;

    setAccountId(account);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?accountId=${account}`);
      setTransactions(response.data.transactions || []);
      setIsConnected(true);
    } catch (error) {
      setError("Failed to fetch transactions for this account.");
    } finally {
      setLoading(false);
    }
  };

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
          <span onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <FaSun color="gold" size={22} /> : <FaMoon color="gray" size={22} />}
          </span>
          <button onClick={fetchTransactionsByAccount} className="connect-button">
            <FaWallet size={18} /> {isConnected ? "Connected ✅" : "Connect Wallet"}
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
                  <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{tx.transaction_id || "N/A"}</td>
                    <td>{new Date(tx.consensus_timestamp * 1000).toLocaleString()}</td>
                    <td>{tx.name || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No transactions found.</p>
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
          background: #000;
          color: white;
        }
        .light {
          background: #fff;
          color: black;
        }
        .header {
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          transition: transform 0.2s ease-in-out;
        }
        .theme-toggle:hover {
          transform: scale(1.1);
        }
        .connect-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 16px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .connect-button:hover {
          background: #218838;
        }
        .table-container {
          max-width: 90%;
          margin: auto;
          overflow-x: auto;
          border-radius: 12px;
        }
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: black;
          color: white;
        }
        .transaction-table th {
          background: black;
          color: white;
          padding: 15px;
          font-size: 18px;
        }
        .transaction-table td {
          padding: 12px;
          font-size: 16px;
        }
        .even-row {
          background: #111;
        }
        .odd-row {
          background: #000;
        }
        .light .transaction-table {
          background: white;
          color: black;
        }
        .light .transaction-table th {
          background: black;
          color: white;
        }
        .light .even-row {
          background: #f9f9f9;
        }
        .light .odd-row {
          background: #fff;
        }
      `}</style>
    </div>
  );
}

export default App;
