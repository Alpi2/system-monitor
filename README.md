# 🖥️ System Monitoring and Task Control Panel

A comprehensive dashboard for monitoring system resources, managing ML models, APIs, and executing system maintenance tasks.

---

## 🔧 Features

- ✅ Real-time system resource monitoring (CPU, GPU, RAM, Disk)
- 🧠 ML model management with live status indicators
- 🌐 API & WebSocket traffic visualization
- 🧹 Process control & automatic cleanup operations
- 🧪 Debugging and testing panel for infrastructure components

---

## 🧱 Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + Tailwind CSS
- **Real-time Communication:** Socket.IO
- **Charts & Graphs:** Chart.js
- **State Management:** TanStack Query (React Query)

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- npm or yarn

---

### 🚀 Installation

1. **Clone the repository**

   Clone the repository

2. **Install frontend dependencies**

   npm install

3. **Install backend dependencies**

   cd backend
   pip install -r requirements.txt

### ▶️ Running the Application

1. **Start the backend server**

   cd backend
   uvicorn main:app --reload

2. **Start the frontend development server**

   npm run dev

3. **Alternatively, start both at once**

   npm run start

## 🛠️ API Endpoints

| Endpoint                          | Description                   |
| --------------------------------- | ----------------------------- |
| `GET /api/system`                 | Get current system statistics |
| `GET /api/processes`              | List of running processes     |
| `GET /api/ml-models`              | ML model metadata & status    |
| `GET /api/api-stats`              | API usage stats               |
| `GET /api/websocket-stats`        | WebSocket connection stats    |
| `GET /api/storage/large-files`    | List large disk usage files   |
| `POST /api/cleanup`               | Trigger system cleanup        |
| `POST /api/process/stop/{pid}`    | Terminate a running process   |
| `POST /api/test/model/{model_id}` | Test a machine learning model |
| `GET /api/test/mongodb`           | MongoDB connection test       |

## 🔄 WebSocket Events

- `system_stats` — Broadcasts real-time system resource updates to the frontend

## 📦 Data Models

- TypeScript interface definitions can be found in:

  src/types/index.ts

## 🪪 License

- This project is licensed under the MIT License
