# DB Supermarket Project

A web application for managing supermarket data, built with React (Frontend), Express (Backend), and MongoDB (Database).

## 🚀 Quick Start (Recommended)

The easiest way to run the project is using **Docker**.

1.  **Prerequisites**: Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running.
2.  Open a terminal in the project root directory.
3.  Run the following command:
    ```bash
    docker-compose up --build
    ```
4.  Once running, access the application:
    -   **Frontend**: [http://localhost:5176](http://localhost:5176)
    -   **Backend API**: [http://localhost:8002](http://localhost:8002)

---

## 🛠️ Manual Installation (Without Docker)

If you prefer to run services individually:

### 1. Database
You need a MongoDB instance running.
-   **Connection String**: `mongodb://localhost:27017`
-   **Credentials**:
    -   User: `root`
    -   Password: `productInSupermarket`
    -   Auth DB: `admin`

### 2. Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configuration**:
    -   Ensure you have a `.env` file (copied from `.env.example`).
    -   **Important**: The frontend expects the backend to run on port **8002**. Update your `.env` to set `EXPRESS_PORT=8002` or change the backend default port.
4.  Start the server:
    ```bash
    npm run dev
    # OR
    node index.js
    ```

### 3. Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the app at the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

---

## 📂 Project Structure

-   **frontend/** - React application (React Router v7)
-   **backend/** - Express.js Node API, Models, and Controllers
-   **docker-compose.yml** - Container orchestration configuration

## ✨ Features

-   **CRUD Operations**: Create, Read, Update, Delete for various entities (Products, Customers, Bills, etc.)
-   **Query Interface**: Specialized queries for business analytics (e.g., Best Selling Items, Employee Rankings).
