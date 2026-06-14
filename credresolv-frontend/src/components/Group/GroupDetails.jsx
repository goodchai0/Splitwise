import { useState, useEffect } from 'react';
import { groupAPI, userAPI } from '../../services/api';
import '../User/User.css';

function GroupDetails({ group, onUpdate }) {
  const [groupData, setGroupData] = useState(group);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    refreshGroup();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const refreshGroup = async () => {
    try {
      const response = await groupAPI.getGroup(group.id);
      setGroupData(response.data);
    } catch (error) {
      console.error('Error refreshing group:', error);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      alert('Please select a user to add');
      return;
    }

    setLoading(true);
    try {
      await groupAPI.addMember(group.id, selectedUserId);
      alert('✅ Member added successfully!');
      setSelectedUserId('');
      await refreshGroup();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Full error:', error);
      
      // Better error handling
      let errorMessage = 'Failed to add member. ';
      
      if (error.response) {
        // Backend returned an error response
        if (typeof error.response.data === 'string') {
          errorMessage += error.response.data;
        } else if (error.response.data?.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += `Status: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage += 'No response from server. Is the backend running?';
      } else {
        // Something else happened
        errorMessage += error.message;
      }
      
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!window.confirm(`Remove ${userName} from this group?`)) {
      return;
    }

    setLoading(true);
    try {
      await groupAPI.removeMember(group.id, userId);
      alert('✅ Member removed successfully!');
      await refreshGroup();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Full error:', error);
      
      let errorMessage = 'Failed to remove member. ';
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage += error.response.data;
        } else if (error.response.data?.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += `Status: ${error.response.status}`;
        }
      } else {
        errorMessage += error.message;
      }
      
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📁 {groupData.name}</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Group ID: #{groupData.id}
      </p>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label>Add Member to Group</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="input"
            style={{ flex: 1 }}
            disabled={loading}
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddMember}
            className="button button-primary"
            disabled={loading || !selectedUserId}
          >
            {loading ? '⏳ Adding...' : '➕ Add'}
          </button>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        👥 Members ({groupData.members?.length || 0})
      </h3>

      {!groupData.members || groupData.members.length === 0 ? (
        <p className="empty-state">No members in this group yet</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupData.members.map((member) => (
                <tr key={member.user.id}>
                  <td>#{member.user.id}</td>
                  <td><strong>{member.user.name}</strong></td>
                  <td>{member.user.email}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveMember(member.user.id, member.user.name)}
                      className="button button-danger button-small"
                      disabled={loading}
                    >
                      ❌ Remove
                    </button>
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

export default GroupDetails;
