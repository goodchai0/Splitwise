import { useState, useEffect } from 'react';
import { expenseAPI } from '../../services/api';
import '../User/User.css';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAllExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.deleteExpense(id);
        alert('✅ Expense deleted successfully!');
        loadExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('❌ Failed to delete expense');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>📋 All Expenses</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📋 All Expenses ({expenses.length})</h2>
      
      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
          No expenses yet. Add your first expense above!
        </p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Paid By</th>
                <th>Group</th>
                <th>Split Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount?.toFixed(2)}</td>
                  <td>{expense.paidBy?.name || 'Unknown'}</td>
                  <td>{expense.group?.name || 'No Group'}</td>
                  <td>
                    <span className={`badge badge-${expense.splitType?.toLowerCase()}`}>
                      {expense.splitType}
                    </span>
                  </td>
                  <td>
                    {expense.createdAt 
                      ? new Date(expense.createdAt).toLocaleDateString('en-IN')
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(expense.id)}
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

export default ExpenseList;
