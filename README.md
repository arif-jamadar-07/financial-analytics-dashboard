# Financial Analytics Dashboard

A full-stack financial analytics dashboard built with **React.js, TypeScript, Material UI, Node.js, Express.js, MongoDB, JWT Authentication, Recharts, and JSON2CSV**.

The application allows authenticated users to view financial analytics, search and filter transactions, sort transaction data, and export customized transaction reports as CSV files.

---

## Table of Contents

* [Features](#features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Backend Setup](#backend-setup)
* [Frontend Setup](#frontend-setup)
* [Database Setup](#database-setup)
* [Authentication Flow](#authentication-flow)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Error Handling](#error-handling)
* [CSV Format](#csv-format)
* [Security](#security)
* [Application Flow](#application-flow)
* [Running the Complete Application](#running-the-complete-application)
* [API Authentication Example](#api-authentication-example)
* [Conclusion](#conclusion)

---

## Features

### Authentication & Security

* JWT-based user authentication
* User registration and login
* Password hashing using `bcrypt`
* Protected transaction APIs
* Automatic authentication header handling from the frontend
* Automatic logout and redirect when the JWT token is invalid or expired

### Financial Dashboard

* Total transaction count
* Total revenue
* Total expenses
* Current balance
* Revenue vs. Expenses monthly chart
* Transaction category breakdown chart
* Responsive dashboard layout
* Light and dark mode

### Transaction Management

* Paginated transaction listing
* Real-time search input
* Category filtering
* Status filtering
* User filtering
* Date range filtering
* Minimum amount filtering
* Maximum amount filtering
* Column-based sorting
* Ascending and descending sort order
* Responsive transaction table

### CSV Export

* Select columns before exporting
* Export only filtered transactions
* Preserve selected sorting
* Generate CSV files on the backend
* Automatic browser download
* CSV headers generated from selected columns

### UI & UX

* Material UI components
* Responsive desktop and mobile layout
* Mobile navigation drawer
* Loading indicators
* Skeleton loaders
* Empty transaction states
* Snackbar alerts
* Status chips
* Export progress state

---

## Technology Stack

### Frontend

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| React.js     | Frontend UI                         |
| TypeScript   | Type-safe development               |
| React Router | Application routing                 |
| Axios        | HTTP requests                       |
| Material UI  | UI components and styling           |
| Recharts     | Data visualization                  |
| Vite         | Frontend development and build tool |

### Backend

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Backend runtime                 |
| Express.js | REST API framework              |
| TypeScript | Type-safe backend development   |
| MongoDB    | Database                        |
| Mongoose   | MongoDB object modeling         |
| JWT        | Authentication                  |
| bcryptjs   | Password hashing                |
| json2csv   | CSV generation                  |
| CORS       | Cross-origin resource sharing   |
| dotenv     | Environment variable management |

---

## Project Structure

```text
financial-analytics-dashboard/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Sidebar.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── theme/
│   │   │   └── theme.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Transaction.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── transactionController.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── transactionRoutes.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Prerequisites

Before running the application, make sure the following are installed:

* **Node.js 18 or later**
* **npm**
* **MongoDB**

MongoDB can be run locally or through **MongoDB Atlas**.

### Check Node.js

```bash
node --version
```

### Check npm

```bash
npm --version
```

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

### Environment Variables

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/financial_analytics

JWT_SECRET=your_super_secret_jwt_key
```

> **Important:** Do not commit your `.env` file or expose your `JWT_SECRET` in a public repository.

### MongoDB Atlas

If you are using MongoDB Atlas, replace `MONGODB_URI` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/financial_analytics
```

### Start the Backend

```bash
npm run dev
```

The backend API will run at:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

This URL is configured in:

```text
frontend/src/services/api.ts
```

---

## Database Setup

Create the MongoDB database:

```text
financial_analytics
```

The application uses two MongoDB collections:

* `users`
* `transactions`

### Users Collection

Example:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "hashed-password"
}
```

Passwords are stored as **bcrypt hashes** rather than plain text.

### Transactions Collection

Example:

```json
{
  "id": 1001,
  "date": "2025-01-15T00:00:00.000Z",
  "amount": 50000,
  "category": "Revenue",
  "status": "Paid",
  "user_id": "admin@example.com",
  "user_profile": ""
}
```

### Transaction Categories

The `category` field supports:

* `Revenue`
* `Expense`

### Transaction Statuses

The `status` field supports:

* `Paid`
* `Pending`

---

## Authentication Flow

The application uses **JWT authentication** to protect transaction-related APIs.

### Step 1 — Register

A user can register using:

```http
POST /api/auth/register
```

### Step 2 — Login

The user logs in using:

```http
POST /api/auth/login
```

The backend validates the credentials and returns a JWT token.

### Step 3 — Store Token

The frontend stores the authentication token in browser local storage:

```text
localStorage.token
```

The logged-in user information is stored as:

```text
localStorage.user
```

### Step 4 — API Requests

Axios automatically adds the JWT token to protected API requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Step 5 — Token Validation

The backend validates the JWT using authentication middleware before allowing access to protected transaction endpoints.

If the token is invalid or expired, the backend returns HTTP `401`, and the frontend removes the authentication data and redirects the user to the login page.

---

# Usage

## Login

Open the application:

```text
http://localhost:5173/login
```

Enter the registered email address and password.

After successful authentication, the application redirects to:

```text
/dashboard
```

---

## Dashboard

The dashboard displays:

* Total Transactions
* Total Revenue
* Total Expense
* Balance
* Revenue vs. Expenses chart
* Category Breakdown chart
* Transaction table

---

## Searching Transactions

Enter a value into:

```text
Search transactions...
```

The search can match:

* Transaction category
* Transaction status
* User ID
* Numeric transaction ID

Click:

```text
Apply Filters
```

to apply the current filter configuration.

---

## Filtering Transactions

Transactions can be filtered using:

* Category
* Status
* User
* From Date
* To Date
* Minimum Amount
* Maximum Amount

Multiple filters can be applied simultaneously.

Click:

```text
Apply Filters
```

to retrieve the filtered transaction list.

---

## Sorting Transactions

Click a table column header such as:

* ID
* Date
* Amount
* Category
* Status

The first click sorts the data in ascending order.

The next click changes the sorting direction to descending.

The current sorting direction is displayed using:

```text
↑
```

or

```text
↓
```

---

## Clearing Filters

Click:

```text
Clear Filters
```

to reset:

* Search
* Category
* Status
* User
* Date range
* Amount range
* Sorting
* Pagination

---

## Exporting CSV

Click:

```text
Export CSV
```

A configuration dialog will open.

Select the fields that should be included in the CSV file.

### Available Export Fields

* Transaction ID
* Date
* Amount
* Category
* Status
* User ID
* User Profile

Click:

```text
Export CSV
```

The backend generates the CSV file and the browser automatically downloads:

```text
financial-transactions.csv
```

The exported data uses the currently applied filters and sorting configuration.

---

# API Documentation

## Base URL

```text
http://localhost:5000/api
```

---

## Authentication APIs

### Register User

```http
POST /auth/register
```

Creates a new user account.

#### Request Body

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "65abc123...",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

#### Possible Errors

| Status | Description                            |
| ------ | -------------------------------------- |
| `400`  | Name, email, and password are required |
| `400`  | User already exists                    |
| `500`  | Failed to create user                  |

---

## Login User

```http
POST /auth/login
```

Authenticates an existing user and returns a JWT token.

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "65abc123...",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Possible Errors

| Status | Description                     |
| ------ | ------------------------------- |
| `400`  | Email and password are required |
| `401`  | Invalid email or password       |
| `500`  | Login failed                    |

---

# Transaction APIs

All transaction endpoints require JWT authentication.

## Authentication Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Get Transactions

```http
GET /transactions
```

Returns a paginated list of transactions.

### Query Parameters

| Parameter   | Type   | Description                                         |
| ----------- | ------ | --------------------------------------------------- |
| `page`      | number | Page number                                         |
| `limit`     | number | Number of records per page                          |
| `search`    | string | Search category, status, user ID, or transaction ID |
| `category`  | string | Filter by category                                  |
| `status`    | string | Filter by status                                    |
| `user`      | string | Filter by user ID                                   |
| `startDate` | date   | Minimum transaction date                            |
| `endDate`   | date   | Maximum transaction date                            |
| `minAmount` | number | Minimum transaction amount                          |
| `maxAmount` | number | Maximum transaction amount                          |
| `sortBy`    | string | Field used for sorting                              |
| `sortOrder` | string | `asc` or `desc`                                     |

### Example Request

```http
GET /api/transactions?page=1&limit=10&category=Revenue&status=Paid&sortBy=date&sortOrder=desc
```

### Success Response

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalTransactions": 50,
    "totalPages": 5
  },
  "filters": {
    "search": "",
    "category": "Revenue",
    "status": "Paid",
    "user": "",
    "startDate": "",
    "endDate": "",
    "minAmount": "",
    "maxAmount": ""
  },
  "sorting": {
    "sortBy": "date",
    "sortOrder": "desc"
  },
  "transactions": []
}
```

---

## Get Filter Options

```http
GET /transactions/options
```

Returns available values for transaction filters.

### Success Response

```json
{
  "success": true,
  "options": {
    "categories": [
      "Revenue",
      "Expense"
    ],
    "statuses": [
      "Paid",
      "Pending"
    ],
    "users": [
      "admin@example.com",
      "user@example.com"
    ]
  }
}
```

This endpoint is used by the frontend to dynamically populate the **Category**, **Status**, and **User** filter dropdowns.

---

## Get Analytics

```http
GET /transactions/analytics
```

Returns dashboard summary metrics and chart data.

### Success Response

```json
{
  "success": true,
  "summary": {
    "totalRevenue": 500000,
    "totalExpense": 200000,
    "balance": 300000,
    "totalTransactions": 100
  },
  "categoryBreakdown": [
    {
      "name": "Revenue",
      "value": 500000
    },
    {
      "name": "Expense",
      "value": 200000
    }
  ],
  "monthlyTrend": [
    {
      "month": "Jan",
      "revenue": 100000,
      "expense": 40000
    },
    {
      "month": "Feb",
      "revenue": 120000,
      "expense": 50000
    }
  ]
}
```

The frontend uses this data for:

* Summary cards
* Revenue vs. Expenses line chart
* Category Breakdown pie chart

---

## Export Transactions

```http
POST /transactions/export
```

Generates a CSV file based on the selected columns, filters, and sorting configuration.

### Request Body

```json
{
  "columns": [
    "id",
    "date",
    "amount",
    "category",
    "status"
  ],
  "search": "",
  "category": "Revenue",
  "status": "Paid",
  "user": "",
  "startDate": "",
  "endDate": "",
  "minAmount": "",
  "maxAmount": "",
  "sortBy": "date",
  "sortOrder": "desc"
}
```

### Available Export Columns

```text
id
date
amount
category
status
user_id
user_profile
```

### Response

The endpoint returns:

```http
Content-Type: text/csv
```

and downloads:

```text
financial-transactions.csv
```

The CSV contains only the selected columns and matching transaction records.

---

# Error Handling

The backend uses HTTP status codes to indicate errors.

| Status Code | Meaning                                  |
| ----------- | ---------------------------------------- |
| `200`       | Request successful                       |
| `201`       | Resource created                         |
| `400`       | Invalid request                          |
| `401`       | Authentication required or token invalid |
| `500`       | Internal server error                    |

The frontend displays errors using **Material UI Snackbar alerts**.

### Example Error Messages

* Login failed
* Failed to load dashboard data
* Failed to load transactions
* Failed to export CSV
* Please select at least one column

---

# CSV Format

The generated CSV contains a header row followed by transaction records.

### Example

```csv
id,date,amount,category,status
1001,2025-01-15T00:00:00.000Z,50000,Revenue,Paid
1002,2025-01-16T00:00:00.000Z,12000,Expense,Paid
1003,2025-01-17T00:00:00.000Z,30000,Revenue,Pending
```

The columns included in the file depend on the user's selection in the **Export Transactions** dialog.

---

# Security

The application implements the following security mechanisms:

* Passwords are hashed using `bcrypt`.
* JWT tokens are used for authentication.
* Protected transaction endpoints require a valid JWT.
* The backend validates JWT tokens before processing protected requests.
* Invalid or expired tokens return HTTP `401`.
* The frontend removes invalid authentication data and redirects the user to the login page.

> **Security Note:** Never commit production secrets, database credentials, JWT secrets, or `.env` files to a public repository.

---

# Application Flow

```text
User
 │
 ▼
Login Page
 │
 │ POST /api/auth/login
 ▼
Backend Authentication
 │
 ▼
JWT Token
 │
 ▼
Frontend Stores Token
 │
 ▼
Dashboard
 │
 ├── GET /transactions/analytics
 │
 ├── GET /transactions/options
 │
 └── GET /transactions
 │
 ▼
User Searches / Filters / Sorts
 │
 ▼
GET /transactions with Query Parameters
 │
 ▼
Filtered Transaction Table
 │
 ▼
Export CSV
 │
 POST /transactions/export
 │
 ▼
Backend Generates CSV
 │
 ▼
Browser Downloads File
```

---

# Running the Complete Application

Make sure MongoDB is running first.

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the Application

Open the frontend in your browser:

```text
http://localhost:5173
```

Register a new user or use an existing account.

After logging in, the dashboard allows you to:

* View financial summary metrics
* Analyze revenue and expenses
* View category distribution
* Search transactions
* Filter transactions
* Sort transaction columns
* Navigate through transaction pages
* Configure CSV export columns
* Export and automatically download CSV reports

---

# API Authentication Example

For protected endpoints, include the JWT token in the request header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Axios Example

```typescript
api.get("/transactions", {
  params: {
    page: 1,
    limit: 10,
    category: "Revenue",
    sortBy: "date",
    sortOrder: "desc",
  },
});
```

The Axios interceptor automatically adds the authentication token to protected API requests.

---

# Conclusion

The **Financial Analytics Dashboard** provides a full-stack solution for viewing, analyzing, filtering, sorting, and exporting financial transaction data.

The project demonstrates practical implementation of:

* React.js and TypeScript frontend development
* Node.js and Express.js backend development
* MongoDB database integration
* JWT authentication
* REST API design
* Dynamic data visualization
* Advanced transaction filtering
* Server-side pagination and sorting
* Configurable CSV report generation
* Automatic browser file downloads
* Responsive and theme-aware UI
* Error handling and loading states

---

## License

This project is available for educational and development purposes.
