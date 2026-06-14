import { useState, useEffect } from 'react';
import { groupAPI } from '../../services/api';
import '../User/User.css';

function GroupList({ onGroupSelect }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAllGroups();
      setGroups(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load groups');
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete group "${name}"?`)) {
      return;
    }

    try {
      await groupAPI.deleteGroup(id);
      alert(`✅ Group "${name}" deleted successfully!`);
      loadGroups();
    } catch (error) {
      alert('Error deleting group: ' + (error.response?.data || error.message));
    }
  };

  if (loading) {
    return <div className="card loading">⏳ Loading groups...</div>;
  }

  if (error) {
    return <div className="card error-message">{error}</div>;
  }

  return (
    <div className="card">
      <h2>📋 All Groups ({groups.length})</h2>
      
      {groups.length === 0 ? (
        <p className="empty-state">No groups yet. Create your first group above!</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Group Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>#{group.id}</td>
                  <td>
                    <strong>{group.name}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => onGroupSelect(group)}
                        className="button button-primary button-small"
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => handleDelete(group.id, group.name)}
                        className="button button-danger button-small"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GroupList;
