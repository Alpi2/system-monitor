import axios from "axios";
import {
  SystemStats,
  Process,
  MLModel,
  ApiStats,
  WebsocketStats,
  StorageItem,
} from "../types";

// In a production environment, this would be determined by environment variables
const API_BASE_URL = "http://localhost:8000/api";

// System Stats
export const fetchSystemStats = async (): Promise<SystemStats> => {
  const response = await axios.get(`${API_BASE_URL}/system`);
  return response.data;
};

// Process List
export const fetchProcesses = async (): Promise<{ processes: Process[] }> => {
  const response = await axios.get(`${API_BASE_URL}/processes`);
  return response.data;
};

export const stopProcess = async (
  pid: number
): Promise<{ status: string; message: string }> => {
  const response = await axios.post(`${API_BASE_URL}/process/stop/${pid}`);
  return response.data;
};

// ML Models
export const fetchMLModels = async (): Promise<{ models: MLModel[] }> => {
  const response = await axios.get(`${API_BASE_URL}/ml-models`);
  return response.data;
};

export interface TestModelResult {
  // Define the expected structure of the result here, for example:
  // prediction: string;
  // confidence: number;
  // If unknown, use Record<string, unknown>
  [key: string]: unknown;
}

export const testModel = async (
  modelId: string
): Promise<{ status: string; message: string; result?: TestModelResult }> => {
  const response = await axios.post(`${API_BASE_URL}/test/model/${modelId}`);
  return response.data;
};

// API Stats
export const fetchApiStats = async (): Promise<ApiStats> => {
  const response = await axios.get(`${API_BASE_URL}/api-stats`);
  return response.data;
};

// WebSocket Stats
export const fetchWebsocketStats = async (): Promise<WebsocketStats> => {
  const response = await axios.get(`${API_BASE_URL}/websocket-stats`);
  return response.data;
};

// Storage/Cleanup
export const fetchLargeFiles = async (
  minSizeMB: number = 100,
  path: string = "/"
): Promise<{ files: StorageItem[] }> => {
  const response = await axios.get(`${API_BASE_URL}/storage/large-files`, {
    params: { min_size_mb: minSizeMB, path },
  });
  return response.data;
};

export const runCleanup = async (
  target: string
): Promise<{
  status: string;
  message: string;
  details?: {
    bytesRemoved: number;
    filesRemoved: number;
    timestamp: string;
  };
}> => {
  const response = await axios.post(`${API_BASE_URL}/cleanup`, null, {
    params: { target },
  });
  return response.data;
};

// Testing
export const testMongoDBConnection = async (
  uri?: string
): Promise<{
  status: string;
  message: string;
  details?: {
    server: string;
    version: string;
    latency: number;
  };
}> => {
  const response = await axios.post(`${API_BASE_URL}/test/mongodb`, null, {
    params: uri ? { uri } : undefined,
  });
  return response.data;
};
