# Personal Finance Tracker

A full-stack web application for tracking personal income and expenses. Built with Node.js, Express.js, MongoDB, and EJS.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **View Engine:** EJS
- **Authentication:** express-session, bcryptjs
- **Styling:** Custom CSS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and update if needed:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/finance-tracker
   SESSION_SECRET=your-secret-key
   ```

3. **Start MongoDB** (ensure MongoDB is running locally)

4. **Run the application:**
   ```bash
   npm start
   ```
   Or: `node app.js`

5. **Open:** http://localhost:3000

## Features

- **Authentication:** Signup, Login, Logout with session-based auth
- **Dashboard:** Total income, expenses, balance, and recent transactions
- **Transactions:** Full CRUD (Create, Read, Update, Delete)
- **Categories:** Income (Salary, Freelance, Investment, etc.) and Expense (Food, Transport, Rent, etc.)
- **Responsive:** Clean UI that works on mobile and desktop

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | / | Redirect to dashboard or login |
| GET | /signup | Signup form |
| POST | /signup | Create account |
| GET | /login | Login form |
| POST | /login | Authenticate |
| GET | /logout | Destroy session |
| GET | /dashboard | Dashboard (protected) |
| GET | /transactions | All transactions (protected) |
| GET | /transactions/new | Add transaction form (protected) |
| POST | /transactions | Create transaction (protected) |
| GET | /transactions/:id/edit | Edit form (protected) |
| PUT | /transactions/:id | Update transaction (protected) |
| DELETE | /transactions/:id | Delete transaction (protected) |
