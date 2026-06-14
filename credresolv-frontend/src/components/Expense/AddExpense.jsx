import { useState, useEffect } from 'react';
import { expenseAPI, groupAPI, userAPI } from '../../services/api';
import '../User/User.css';

function AddExpense({ onExpenseAdded }) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidByUserId: '',
    groupId: '',
    splitType: 'EQUAL',
  });
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [exactAmounts, setExactAmounts] = useState({});
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  useEffect(() => {
    if (formData.groupId) {
      loadGroupMembers(formData.groupId);
    }
  }, [formData.groupId]);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAllGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await groupAPI.getGroup(groupId);
      const members = response.data.members || [];
      setGroupMembers(members.map(m => m.user));
      setSelectedUsers([]);
      setExactAmounts({});
      setPercentages({});
    } catch (error) {
      console.error('Error loading group members:', error);
      setGroupMembers([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      const newExactAmounts = { ...exactAmounts };
      delete newExactAmounts[userId];
      setExactAmounts(newExactAmounts);
      const newPercentages = { ...percentages };
      delete newPercentages[userId];
      setPercentages(newPercentages);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedUsers.length === 0) {
        throw new Error('Please select at least one user to split with');
      }

      // Build splitData based on split type
      let splitData = {};
      
      if (formData.splitType === 'EQUAL') {
        // For equal split, just send user IDs with 0 value
        selectedUsers.forEach(userId => {
          splitData[userId] = 0;
        });
      } else if (formData.splitType === 'EXACT') {
        splitData = { ...exactAmounts };
        const total = Object.values(splitData).reduce((sum, val) => sum + parseFloat(val || 0), 0);
        if (Math.abs(total - parseFloat(formData.amount)) > 0.01) {
          throw new Error(`Exact amounts must sum to ₹${formData.amount}. Current total: ₹${total}`);
        }
      } else if (formData.splitType === 'PERCENTAGE') {
        splitData = { ...percentages };
        const total = Object.values(splitData).reduce((sum, val) => sum + parseFloat(val || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          throw new Error(`Percentages must sum to 100%. Current total: ${total}%`);
        }
      }

      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidByUserId: parseInt(formData.paidByUserId),
        groupId: parseInt(formData.groupId),
        splitType: formData.splitType,
        splitData: splitData,
      };

      console.log('Sending expense data:', expenseData);

      await expenseAPI.addExpense(expenseData);
      
      alert('✅ Expense added successfully!');
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        paidByUserId: '',
        groupId: '',
        splitType: 'EQUAL',
      });
      setSelectedUsers([]);
      setExactAmounts({});
      setPercentages({});
      
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to add expense';
      setError(errorMsg);
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>💸 Add New Expense</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g., Lunch, Movie tickets"
            value={formData.description}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Total Amount (₹) *</label>
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
          <label htmlFor="paidByUserId">Paid By *</label>
          <select
            id="paidByUserId"
            name="paidByUserId"
            value={formData.paidByUserId}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
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
            <option value="">-- No Group --</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="splitType">Split Type *</label>
          <select
            id="splitType"
            name="splitType"
            value={formData.splitType}
            onChange={handleChange}
            required
            className="input"
            disabled={loading}
          >
            <option value="EQUAL">Equal Split</option>
            <option value="EXACT">Exact Amounts</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Users to Split With *</label>
          <div style={{ marginTop: '0.5rem' }}>
            {(formData.groupId ? groupMembers : users).map(user => (
              <div key={user.id} style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                    disabled={loading}
                  />
                  <span>{user.name}</span>
                  
                  {formData.splitType === 'EXACT' && selectedUsers.includes(user.id) && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={exactAmounts[user.id] || ''}
                      onChange={(e) => setExactAmounts({
                        ...exactAmounts,
                        [user.id]: e.target.value
                      })}
                      className="input"
                      style={{ width: '120px', marginLeft: 'auto' }}
                      disabled={loading}
                    />
                  )}
                  
                  {formData.splitType === 'PERCENTAGE' && selectedUsers.includes(user.id) && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="%"
                      value={percentages[user.id] || ''}
                      onChange={(e) => setPercentages({
                        ...percentages,
                        [user.id]: e.target.value
                      })}
                      className="input"
                      style={{ width: '100px', marginLeft: 'auto' }}
                      disabled={loading}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="button button-primary"
          disabled={loading}
        >
          {loading ? '⏳ Adding...' : '✅ Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
