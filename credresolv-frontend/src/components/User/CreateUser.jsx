import { useState } from 'react';
import { userAPI } from '../../services/api';
import './User.css';

function CreateUser({ onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.createUser({ name, email });
      alert(`✅ User "${response.data.name}" created successfully!`);
      setName('');
      setEmail('');
      if (onUserCreated) onUserCreated();
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      setError(`Error: ${errorMsg}`);
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>➕ Create New User</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? '⏳ Creating...' : '✅ Create User'}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
