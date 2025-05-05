# System Monitoring and Task Control Panel

A comprehensive dashboard for monitoring system resources, ML models, APIs, and performing maintenance tasks.

## Features

- Real-time hardware monitoring (CPU, GPU, RAM, disk usage)
- ML model management with status indicators
- API and WebSocket traffic monitoring
- Automatic cleanup and process management
- Testing and debugging panel

## Tech Stack

- **Backend**: FastAPI with Python
- **Frontend**: React with TypeScript and Tailwind CSS
- **Data Visualization**: Chart.js
- **Real-time Updates**: Socket.IO
- **State Management**: TanStack Query (React Query)

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- npm or yarn

### Installation

1. Clone the repository

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server
```bash
npm run dev
```

3. Or start both at once
```bash
npm run start
```

## API Endpoints

- `/api/system` - Get current system statistics
- `/api/processes` - Get list of running processes
- `/api/ml-models` - Get ML model information
- `/api/api-stats` - Get API usage statistics
- `/api/websocket-stats` - Get WebSocket statistics
- `/api/storage/large-files` - Get list of large files
- `/api/cleanup` - Run cleanup operations
- `/api/process/stop/{pid}` - Stop a process
- `/api/test/model/{model_id}` - Test a model
- `/api/test/mongodb` - Test MongoDB connection

## WebSocket Events

- `system_stats` - Real-time system statistics updates

## Data Models

See `src/types/index.ts` for TypeScript interface definitions of all data models.

## License

MIT