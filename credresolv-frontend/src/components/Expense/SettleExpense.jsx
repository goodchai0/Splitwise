import { useState, useEffect } from 'react';
import { balanceAPI, userAPI, groupAPI } from '../../services/api';
import '../User/User.css';

function SettleExpense() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    fromUserId: '',
    toUserId: '',
    amount: '',
    groupId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    loadGroups();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAllGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.fromUserId || !formData.toUserId || !formData.amount) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(formData.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (formData.fromUserId === formData.toUserId) {
        throw new Error('Cannot settle balance with yourself');
      }

      const settleData = {
        fromUserId: parseInt(formData.fromUserId),
        toUserId: parseInt(formData.toUserId),
        amount: parseFloat(formData.amount),
        groupId: formData.groupId ? parseInt(formData.groupId) : null,
      };

      await balanceAPI.settleBalance(settleData);
      
      alert('✅ Balance settled successfully!');
      
      // Reset form
      setFormData({
        fromUserId: '',
        toUserId: '',
        amount: '',
        groupId: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to settle balance';
      setError(errorMsg);
      console.error('Error settling balance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>✅ Settle Balance</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Record a payment to settle outstanding balances
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="fromUserId">From (Who is paying) *</label>
          <select
            id="fromUserId"
            name="fromUserId"
            value={formData.fromUserId}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="toUserId">To (Who is receiving) *</label>
          <select
            id="toUserId"
            name="toUserId"
            value={formData.toUserId}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹) *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="500"
            value={formData.amount}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="groupId">Group (Optional)</label>
          <select
            id="groupId"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            className="input"
            disabled={loading}
          >
            <option value="">-- No specific group --</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="button button-primary"
          disabled={loading}
        >
          {loading ? '⏳ Settling...' : '✅ Settle Balance'}
        </button>
      </form>
    </div>
  );
}

export default SettleExpense;
