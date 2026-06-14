import { useState } from 'react';
import { groupAPI } from '../../services/api';
import '../User/User.css';

function CreateGroup({ onGroupCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await groupAPI.createGroup({ name });
      alert(`✅ Group "${response.data.name}" created successfully!`);
      setName('');
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      setError(`Error: ${errorMsg}`);
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>➕ Create New Group</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="groupName">Group Name *</label>
          <input
            id="groupName"
            type="text"
            placeholder="e.g., Roommates, Trip to Goa, Office Lunch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="button button-primary"
          disabled={loading}
        >
          {loading ? '⏳ Creating...' : '✅ Create Group'}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
