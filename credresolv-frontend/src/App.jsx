import { useState } from 'react'
import './App.css'
import CreateUser from './components/User/CreateUser'
import UserList from './components/User/UserList'
import CreateGroup from './components/Group/CreateGroup'
import GroupList from './components/Group/GroupList'
import GroupDetails from './components/Group/GroupDetails'
import AddExpense from './components/Expense/AddExpense'
import ExpenseList from './components/Expense/ExpenseList'
import BalanceView from './components/Balance/BalanceView'
import SettleExpense from './components/Expense/SettleExpense'

function App() {
  const [activeTab, setActiveTab] = useState('users')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState(null)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setActiveTab('groupDetails')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 CredResolv</h1>
        <p>Split expenses easily with friends and family</p>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'groups' ? 'active' : ''} 
          onClick={() => setActiveTab('groups')}
        >
          📁 Groups
        </button>
        <button 
          className={activeTab === 'expenses' ? 'active' : ''} 
          onClick={() => setActiveTab('expenses')}
        >
          💸 Expenses
        </button>
        <button 
          className={activeTab === 'balances' ? 'active' : ''} 
          onClick={() => setActiveTab('balances')}
        >
          📊 Balances
        </button>
        <button 
          className={activeTab === 'settle' ? 'active' : ''} 
          onClick={() => setActiveTab('settle')}
        >
          ✅ Settle
        </button>
      </nav>

      <main className="content">
        {activeTab === 'users' && (
          <div className="tab-content">
            <CreateUser onUserCreated={handleRefresh} />
            <UserList key={refreshTrigger} />
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="tab-content">
            <CreateGroup onGroupCreated={handleRefresh} />
            <GroupList 
              key={refreshTrigger} 
              onGroupSelect={handleGroupSelect}
            />
          </div>
        )}

        {activeTab === 'groupDetails' && selectedGroup && (
          <div className="tab-content">
            <button 
              className="back-button" 
              onClick={() => setActiveTab('groups')}
            >
              ← Back to Groups
            </button>
            <GroupDetails 
              group={selectedGroup} 
              onUpdate={handleRefresh}
            />
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="tab-content">
            <AddExpense onExpenseAdded={handleRefresh} />
            <ExpenseList key={refreshTrigger} />
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="tab-content">
            <BalanceView key={refreshTrigger} />
          </div>
        )}

        {activeTab === 'settle' && (
          <div className="tab-content">
            <SettleExpense onSettled={handleRefresh} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>CredResolv © 2025 | Built with Spring Boot & React</p>
      </footer>
    </div>
  )
}

export default App
