from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import socketio
import psutil
import json
import time
import os
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="System Monitoring API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO server setup
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio)
app.mount("/ws", socket_app)

# Connected clients
connected_clients = set()

# Mock ML models data - in production, this would connect to a real ML system
ml_models = [
    {
        "id": "model1",
        "name": "BERT-base",
        "status": "inference",
        "gpuMemoryUsage": 4.2,
        "gpuMemoryTotal": 8,
        "active": True,
        "type": "transformer",
        "lastActivity": datetime.now().isoformat()
    },
    {
        "id": "model2",
        "name": "ResNet-50",
        "status": "idle",
        "gpuMemoryUsage": 0,
        "gpuMemoryTotal": 8,
        "active": False,
        "type": "cnn",
        "lastActivity": datetime.now().isoformat()
    },
    {
        "id": "model3",
        "name": "GPT-2",
        "status": "training",
        "gpuMemoryUsage": 7.8,
        "gpuMemoryTotal": 8,
        "active": True,
        "type": "transformer",
        "lastActivity": datetime.now().isoformat()
    }
]

# Mock API stats data - in production, this would track real API usage
api_stats = {
    "totalRequests": 1245,
    "activeConnections": 3,
    "requestsPerMinute": 12.5,
    "avgResponseTime": 125,  # ms
    "statusCodes": {
        "200": 1156,
        "404": 45,
        "500": 12,
        "429": 32
    },
    "endpoints": [
        {
            "path": "/api/predict",
            "method": "POST",
            "count": 856,
            "avgResponseTime": 145
        },
        {
            "path": "/api/users",
            "method": "GET",
            "count": 389,
            "avgResponseTime": 85
        }
    ]
}

# Mock WebSocket stats
websocket_stats = {
    "activeConnections": 0,
    "messagesPerSecond": 0,
    "bytesTransferred": 0,
    "transferRate": 0  # kbit/s
}

# Network stats for tracking
prev_net_io = psutil.net_io_counters()
prev_time = time.time()

@app.get("/")
async def root():
    return {"message": "System Monitoring API is running"}

@app.get("/api/system")
async def get_system_stats():
    """Get current system statistics (CPU, memory, disk, network)"""
    global prev_net_io, prev_time
    
    # CPU stats
    cpu_percent = psutil.cpu_percent(interval=0.5)
    cpu_count = psutil.cpu_count()
    per_cpu = psutil.cpu_percent(interval=0.5, percpu=True)
    
    # Memory stats
    memory = psutil.virtual_memory()
    
    # Disk stats
    disk = psutil.disk_usage('/')
    disk_io = psutil.disk_io_counters()
    
    # Network stats
    net_io = psutil.net_io_counters()
    current_time = time.time()
    time_diff = current_time - prev_time
    
    sent_speed = (net_io.bytes_sent - prev_net_io.bytes_sent) / time_diff
    recv_speed = (net_io.bytes_recv - prev_net_io.bytes_recv) / time_diff
    
    prev_net_io = net_io
    prev_time = current_time
    
    # GPU stats - this is mocked, in production would use nvidia-smi or similar
    gpu_stats = [
        {
            "name": "NVIDIA GeForce RTX 3080",
            "temperature": 65,
            "memory": {
                "total": 10240,  # MB
                "used": 3584,    # MB
                "percent": 35
            },
            "utilization": 40
        }
    ]
    
    return {
        "cpu": {
            "usage": cpu_percent,
            "temperature": 55,  # Mocked, would use lm-sensors in prod
            "coreCount": cpu_count,
            "coreUsage": per_cpu
        },
        "memory": {
            "total": memory.total,
            "used": memory.used,
            "percent": memory.percent
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "percent": disk.percent,
            "io": {
                "read_count": disk_io.read_count,
                "write_count": disk_io.write_count,
                "read_bytes": disk_io.read_bytes,
                "write_bytes": disk_io.write_bytes
            }
        },
        "gpu": gpu_stats,
        "network": {
            "sent": net_io.bytes_sent,
            "received": net_io.bytes_recv,
            "sentSpeed": sent_speed,
            "receivedSpeed": recv_speed
        }
    }

@app.get("/api/processes")
async def get_processes():
    """Get list of running processes sorted by CPU usage"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'status', 'cpu_percent', 'memory_percent', 'create_time', 'cmdline']):
        try:
            pinfo = proc.info
            processes.append({
                "pid": pinfo['pid'],
                "name": pinfo['name'],
                "cpu_percent": pinfo['cpu_percent'],
                "memory_percent": pinfo['memory_percent'],
                "status": pinfo['status'],
                "create_time": pinfo['create_time'],
                "username": pinfo['username'],
                "cmdline": pinfo['cmdline']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    # Sort by CPU usage (descending)
    processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
    return {"processes": processes[:20]}  # Return top 20 processes

@app.get("/api/ml-models")
async def get_ml_models():
    """Get ML model information"""
    return {"models": ml_models}

@app.get("/api/api-stats")
async def get_api_stats():
    """Get API usage statistics"""
    return api_stats

@app.get("/api/websocket-stats")
async def get_websocket_stats():
    """Get WebSocket statistics"""
    websocket_stats["activeConnections"] = len(connected_clients)
    return websocket_stats

@app.get("/api/storage/large-files")
async def get_large_files(min_size_mb: int = 100, path: str = "/"):
    """Get list of large files in the specified directory"""
    # This is a mock implementation
    # In production, would use os.walk to find actual large files
    large_files = [
        {
            "path": "/data/dataset1.zip",
            "size": 1024 * 1024 * 500,  # 500 MB
            "modified": "2023-05-15T10:30:00",
            "type": "file"
        },
        {
            "path": "/logs/application_logs.tar.gz",
            "size": 1024 * 1024 * 250,  # 250 MB
            "modified": "2023-05-14T08:15:00",
            "type": "file"
        },
        {
            "path": "/temp/cache",
            "size": 1024 * 1024 * 1500,  # 1.5 GB
            "modified": "2023-05-13T20:45:00",
            "type": "directory"
        }
    ]
    return {"files": large_files}

@app.post("/api/test/model/{model_id}")
async def test_model(model_id: str):
    """Test loading and inference on a specific model"""
    # Mock implementation
    time.sleep(1)  # Simulate model loading time
    found = False
    
    for model in ml_models:
        if model["id"] == model_id:
            found = True
            break
    
    if not found:
        return {"status": "failure", "message": f"Model {model_id} not found"}
    
    return {
        "status": "success",
        "message": f"Model {model_id} loaded successfully",
        "result": {
            "loadTime": 0.85,
            "inferenceTime": 0.12,
            "memoryUsed": 2.3
        }
    }

@app.post("/api/test/mongodb")
async def test_mongodb_connection(uri: Optional[str] = None):
    """Test MongoDB connection"""
    # Mock implementation
    time.sleep(0.5)  # Simulate connection attempt
    
    # In production, would use pymongo to actually test the connection
    return {
        "status": "success",
        "message": "MongoDB connection successful",
        "details": {
            "server": "mongodb://localhost:27017",
            "version": "5.0.6",
            "latency": 5.2
        }
    }

@app.post("/api/cleanup")
async def run_cleanup(target: str):
    """Run cleanup operations on specified target"""
    valid_targets = ["logs", "temp", "cache"]
    
    if target not in valid_targets:
        return {"status": "failure", "message": f"Invalid target: {target}"}
    
    # Mock implementation
    time.sleep(1)  # Simulate cleanup operation
    
    return {
        "status": "success",
        "message": f"Cleaned up {target} directory",
        "details": {
            "bytesRemoved": 1024 * 1024 * 150,  # 150 MB
            "filesRemoved": 32,
            "timestamp": datetime.now().isoformat()
        }
    }

@app.post("/api/process/stop/{pid}")
async def stop_process(pid: int):
    """Stop a process by PID"""
    try:
        process = psutil.Process(pid)
        process_name = process.name()
        
        # In production, would actually terminate the process
        # process.terminate()
        
        return {
            "status": "success",
            "message": f"Process {process_name} (PID: {pid}) has been stopped"
        }
    except psutil.NoSuchProcess:
        return {"status": "failure", "message": f"Process with PID {pid} not found"}
    except psutil.AccessDenied:
        return {"status": "failure", "message": f"Access denied when trying to stop process {pid}"}

@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    logger.info(f"Client connected: {sid}")
    connected_clients.add(sid)
    websocket_stats["activeConnections"] = len(connected_clients)

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {sid}")
    if sid in connected_clients:
        connected_clients.remove(sid)
    websocket_stats["activeConnections"] = len(connected_clients)

async def broadcast_system_stats():
    """Broadcast system stats to all connected clients"""
    while True:
        if connected_clients:
            try:
                stats = await get_system_stats()
                await sio.emit("system_stats", stats)
                websocket_stats["messagesPerSecond"] += 1
                websocket_stats["bytesTransferred"] += len(json.dumps(stats))
                websocket_stats["transferRate"] = websocket_stats["bytesTransferred"] / 1024  # kbit
            except Exception as e:
                logger.error(f"Error broadcasting stats: {e}")
        
        await asyncio.sleep(2)  # Update every 2 seconds

@app.on_event("startup")
async def startup_event():
    """Start background tasks on application startup"""
    asyncio.create_task(broadcast_system_stats())
    logger.info("System monitoring API started")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)