export interface SystemStats {
  cpu: {
    usage: number;
    temperature: number;
    coreCount: number;
    coreUsage: number[];
  };
  memory: {
    total: number;
    used: number;
    percent: number;
  };
  disk: {
    total: number;
    used: number;
    percent: number;
    io: {
      read_count: number;
      write_count: number;
      read_bytes: number;
      write_bytes: number;
    };
  };
  gpu?: {
    name: string;
    temperature: number;
    memory: {
      total: number;
      used: number;
      percent: number;
    };
    utilization: number;
  }[];
  network: {
    sent: number;
    received: number;
    sentSpeed: number;
    receivedSpeed: number;
  };
}

export interface Process {
  pid: number;
  name: string;
  cpu_percent: number;
  memory_percent: number;
  status: string;
  create_time: number;
  username: string;
  cmdline: string[];
}

export interface MLModel {
  id: string;
  name: string;
  status: 'training' | 'inference' | 'idle';
  gpuMemoryUsage: number;
  gpuMemoryTotal: number;
  active: boolean;
  type: string;
  lastActivity: string;
}

export interface ApiStats {
  totalRequests: number;
  activeConnections: number;
  requestsPerMinute: number;
  avgResponseTime: number;
  statusCodes: {
    [key: string]: number;
  };
  endpoints: {
    path: string;
    method: string;
    count: number;
    avgResponseTime: number;
  }[];
}

export interface WebsocketStats {
  activeConnections: number;
  messagesPerSecond: number;
  bytesTransferred: number;
  transferRate: number; // kbit/s
}

export interface StorageItem {
  path: string;
  size: number;
  modified: string;
  type: 'file' | 'directory';
}

export interface TestResult {
  name: string;
  status: 'success' | 'failure' | 'pending';
  message?: string;
  duration?: number;
  timestamp: string;
}