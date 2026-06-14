import { useState, useEffect } from 'react';
import { balanceAPI, userAPI } from '../../services/api';
import '../User/User.css';

function BalanceView() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleShowBalances = async () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await balanceAPI.getUserBalances(selectedUserId);
      setBalances(response.data);
      
      if (Object.keys(response.data).length === 0) {
        setError('No balances found for this user');
      }
    } catch (error) {
      console.error('Error loading balances:', error);
      setError('Failed to load balances');
      setBalances({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📊 View Balances</h2>
      
      <div className="form-group">
        <label htmlFor="userSelect">Select User *</label>
        <select
          id="userSelect"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="input"
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleShowBalances}
        className="button button-primary"
        disabled={loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? '⏳ Loading...' : '💰 Show Balances'}
      </button>

      {error && (
        <div className="error-message" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {!error && Object.keys(balances).length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Balance Summary</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(balances).map(([person, amount]) => (
                  <tr key={person}>
                    <td>{person}</td>
                    <td style={{ 
                      fontWeight: 'bold',
                      color: amount > 0 ? '#4caf50' : amount < 0 ? '#f44336' : '#666'
                    }}>
                      ₹{Math.abs(amount).toFixed(2)}
                    </td>
                    <td>
                      {amount > 0 ? (
                        <span className="badge badge-success">
                          You get back
                        </span>
                      ) : amount < 0 ? (
                        <span className="badge badge-danger">
                          You owe
                        </span>
                      ) : (
                        <span className="badge badge-settled">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BalanceView;
