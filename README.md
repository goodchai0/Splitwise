# 💰 Splitwise - Expense Sharing Application

A full-stack expense sharing application that allows users to split expenses among friends and track balances. Built with **Spring Boot** (Backend) and **React** (Frontend).

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Maven](https://img.shields.io/badge/Maven-3.9-red)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Design Patterns](#-design-patterns)
- [Demo Data](#-demo-data)

---

## ✨ Features

### Core Functionality
- ✅ **User Management** - Create, view, update, and delete users
- ✅ **Group Management** - Create groups and manage members
- ✅ **Expense Tracking** - Record expenses with multiple split types:
  - **Equal Split** - Divide equally among participants
  - **Exact Amount Split** - Specify exact amounts for each person
  - **Percentage Split** - Split based on percentage shares
- ✅ **Balance Calculation** - Automatic calculation of who owes whom
- ✅ **Settlement Recording** - Track payments between users
- ✅ **Group & Personal Expenses** - Support for both group and individual expenses

### Technical Features
- 🔄 RESTful API architecture
- 🎨 Responsive UI design
- 🔐 Data validation and error handling
- 💾 H2 in-memory database with console access
- 🏗️ Strategy Pattern for expense split calculations
- 🔗 Proper JPA entity relationships

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** H2 (In-Memory)
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **API:** RESTful Web Services

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Styling:** CSS3 (Custom)
- **State Management:** React Hooks (useState, useEffect)

---

## 📁 Project Structure

```
splitwise-expense-sharing/
│
├── README.md
├── .gitignore
│
├── credresolv-backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/credresolv/
│   │   │   │   ├── controller/           # REST Controllers
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── GroupController.java
│   │   │   │   │   ├── ExpenseController.java
│   │   │   │   │   └── BalanceController.java
│   │   │   │   ├── entity/               # JPA Entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Group.java
│   │   │   │   │   ├── Expense.java
│   │   │   │   │   └── Split.java
│   │   │   │   ├── repository/           # JPA Repositories
│   │   │   │   ├── service/              # Business Logic
│   │   │   │   ├── strategy/             # Split Strategy Pattern
│   │   │   │   │   ├── SplitStrategy.java
│   │   │   │   │   ├── EqualSplitStrategy.java
│   │   │   │   │   ├── ExactSplitStrategy.java
│   │   │   │   │   ├── PercentageSplitStrategy.java
│   │   │   │   │   └── SplitStrategyFactory.java
│   │   │   │   └── config/               # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── credresolv-frontend/                   # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── User/
    │   │   │   ├── CreateUser.jsx
    │   │   │   ├── UserList.jsx
    │   │   │   └── User.css
    │   │   ├── Group/
    │   │   │   ├── CreateGroup.jsx
    │   │   │   ├── GroupList.jsx
    │   │   │   └── GroupDetails.jsx
    │   │   ├── Expense/
    │   │   │   ├── AddExpense.jsx
    │   │   │   ├── ExpenseList.jsx
    │   │   │   ├── SettleExpense.jsx
    │   │   │   └── Expense.css
    │   │   ├── Balance/
    │   │   │   ├── BalanceView.jsx
    │   │   │   └── Balance.css
    │   │   └── Layout/
    │   │       ├── Header.jsx
    │   │       └── Navigation.jsx
    │   ├── pages/
    │   ├── services/
    │   │   └── api.js                     # API Service Layer
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- Git
- Maven (optional, included in project)

### Backend Setup

```bash
# Navigate to backend directory
cd credresolv-backend

# Build the project (Windows)
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

**Backend will start on:** `http://localhost:8080`

**H2 Database Console:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:credresolv`
- **Username:** `sa`
- **Password:** _(leave empty)_

### Frontend Setup

```bash
# Navigate to frontend directory
cd credresolv-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

---

## 📖 Usage

### 1. Create Users
Navigate to **Users** tab and add users:
```
Name: Alice
Email: alice@example.com
```

### 2. Create Groups
Go to **Groups** tab and create a group:
```
Group Name: Trip to Goa
Members: Add Alice, Bob, Charlie
```

### 3. Add Expenses
Navigate to **Expenses** tab:

**Equal Split Example:**
- Description: Hotel Booking
- Amount: 12000
- Paid By: Alice
- Group: Trip to Goa
- Split Type: Equal Split

**Exact Split Example:**
- Description: Flight Tickets
- Amount: 15000
- Split Type: Exact Amounts
  - Alice: 4000
  - Bob: 5500
  - Charlie: 5500

**Percentage Split Example:**
- Description: Dinner
- Amount: 2000
- Split Type: Percentage
  - Alice: 40%
  - Bob: 30%
  - Charlie: 30%

### 4. Check Balances
Go to **Balances** tab → Select a user to view their balances

### 5. Settle Balances
Navigate to **Settle** tab → Record payments between users

---

## 🔌 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups` | Get all groups |
| GET | `/api/groups/{id}` | Get group by ID |
| POST | `/api/groups` | Create new group |
| POST | `/api/groups/{groupId}/members/{userId}` | Add member to group |
| DELETE | `/api/groups/{groupId}/members/{userId}` | Remove member |
| DELETE | `/api/groups/{id}` | Delete group |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Create new expense |
| GET | `/api/expenses/group/{groupId}` | Get group expenses |
| GET | `/api/expenses/user/{userId}` | Get user expenses |
| DELETE | `/api/expenses/{id}` | Delete expense |

### Balances
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/balances/user/{userId}` | Get user balances |
| GET | `/api/balances/group/{groupId}/user/{userId}` | Get group balances |
| POST | `/api/balances/settle` | Settle balance |

---

## 🎨 Design Patterns

### Strategy Pattern
Different expense split strategies implemented using Strategy Pattern:

```java
public interface SplitStrategy {
    void split(Expense expense, List<Split> splits);
}

// Implementations:
- EqualSplitStrategy
- ExactSplitStrategy  
- PercentageSplitStrategy
```

### Factory Pattern
**SplitStrategyFactory** returns appropriate strategy based on split type

### Repository Pattern
JPA Repositories for data access abstraction

---

## 🧪 Demo Data

### Test Users
```
Alice - alice@example.com
Bob - bob@example.com
Charlie - charlie@example.com
Diana - diana@example.com
```

### Test Groups
```
1. Trip to Goa (Alice, Bob, Charlie, Diana)
2. Apartment Rent (Alice, Bob, Charlie)
3. Office Lunch (Bob, Charlie, Diana)
```

### Test Expenses
```
1. Hotel: ₹12,000 (Equal) - Alice paid
2. Flights: ₹15,000 (Exact) - Bob paid
3. Dinner: ₹2,000 (Percentage) - Charlie paid
```

---

## 🔮 Future Enhancements

- User authentication (JWT)
- Email notifications
- Export reports as PDF/CSV
- Multi-currency support
- Recurring expenses
- Mobile app

---

## 👨‍💻 Author

**Biswojit Sahoo**
- Email: sahoobiswojit2001@gmail.com
- GitHub: [@biswojit-11](https://github.com/biswojit-11)

---

## 📄 License

This project is created for educational purposes as part of a full-stack development assignment.

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Splitwise for inspiration

---

**⭐ If you found this project helpful, please give it a star!**
