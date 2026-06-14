import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Group APIs
export const groupAPI = {
  getAllGroups: () => api.get('/groups'),
  getGroup: (id) => api.get(`/groups/${id}`),
  createGroup: (groupData) => api.post('/groups', groupData),
  addMember: (groupId, userId) => api.post(`/groups/${groupId}/members/${userId}`),
  removeMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`),
  getUserGroups: (userId) => api.get(`/groups/user/${userId}`),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
};

// Expense APIs
export const expenseAPI = {
  getAllExpenses: () => api.get('/expenses'),
  getExpense: (id) => api.get(`/expenses/${id}`),
  addExpense: (expenseData) => api.post('/expenses', expenseData),
  getGroupExpenses: (groupId) => api.get(`/expenses/group/${groupId}`),
  getUserExpenses: (userId) => api.get(`/expenses/user/${userId}`),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

// Balance APIs - FIXED ENDPOINTS
export const balanceAPI = {
  getUserBalances: (userId) => api.get(`/balances/user/${userId}`),
  getGroupBalances: (groupId, userId) => api.get(`/balances/group/${groupId}/user/${userId}`),
  settleBalance: (settleData) => api.post('/balances/settle', settleData),
};

export default api;
