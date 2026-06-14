import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import './User.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }

    try {
      await userAPI.deleteUser(id);
      alert(`✅ User "${name}" deleted successfully!`);
      loadUsers();
    } catch (error) {
      alert('Error deleting user: ' + (error.response?.data || error.message));
    }
  };

  if (loading) {
    return <div className="card loading">⏳ Loading users...</div>;
  }

  if (error) {
    return <div className="card error-message">{error}</div>;
  }

  return (
    <div className="card">
      <h2>📋 All Users ({users.length})</h2>
      
      {users.length === 0 ? (
        <p className="empty-state">No users yet. Create your first user above!</p>
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="button button-danger button-small"
                    >
                      🗑️ Delete
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

export default UserList;
