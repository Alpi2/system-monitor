import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wifi, Users, ArrowDownCircle, Database } from 'lucide-react';
import { fetchWebsocketStats } from '../api/systemApi';
import { formatBytes } from '../utils/formatters';

interface WebsocketMonitoringProps {
  darkMode: boolean;
}

const WebsocketMonitoring: React.FC<WebsocketMonitoringProps> = ({ darkMode }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['websocketStats'],
    queryFn: fetchWebsocketStats,
    refetchInterval: 2000, // More frequent updates
  });
  
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Loading WebSocket metrics...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading WebSocket metrics: {(error as Error).message}</div>;
  }
  
  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
          <Users className="mr-3 text-blue-500" size={24} />
          <div>
            <div className="text-sm mb-1">Active Connections</div>
            <div className="text-2xl font-semibold">{data?.activeConnections}</div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
          <Database className="mr-3 text-indigo-500" size={24} />
          <div>
            <div className="text-sm mb-1">Data Transferred</div>
            <div className="text-2xl font-semibold">{formatBytes(data?.bytesTransferred || 0)}</div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
          <Wifi className="mr-3 text-green-500" size={24} />
          <div>
            <div className="text-sm mb-1">Messages/Second</div>
            <div className="text-2xl font-semibold">{data?.messagesPerSecond}</div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
          <ArrowDownCircle className="mr-3 text-purple-500" size={24} />
          <div>
            <div className="text-sm mb-1">Transfer Rate</div>
            <div className="text-2xl font-semibold">{data?.transferRate.toFixed(2)} kbit/s</div>
          </div>
        </div>
      </div>
      
      {/* Connection Details */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="font-semibold mb-3">Real-time Connection Status</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Connection Health</span>
            <span className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Healthy
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-green-500" style={{ width: '98%' }}></div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center">
              <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ping:</span>
              <span className="font-medium">24ms</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uptime:</span>
              <span className="font-medium">3h 42m</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Protocol:</span>
              <span className="font-medium">Socket.IO</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Log */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="font-semibold mb-3">WebSocket Event Log</h3>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-h-64 overflow-y-auto font-mono text-xs`}>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-green-500 mr-2">[10:45:23]</span>
              <span>Client connected: 7a9c42e5</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[10:45:24]</span>
              <span>Event 'system_stats' emitted (2.3KB)</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[10:45:26]</span>
              <span>Event 'system_stats' emitted (2.4KB)</span>
            </div>
            <div className="flex">
              <span className="text-yellow-500 mr-2">[10:45:28]</span>
              <span>Client ping: 54ms (7a9c42e5)</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[10:45:28]</span>
              <span>Event 'system_stats' emitted (2.2KB)</span>
            </div>
            <div className="flex">
              <span className="text-green-500 mr-2">[10:45:30]</span>
              <span>Client connected: 3f6d81b2</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[10:45:30]</span>
              <span>Event 'system_stats' emitted (2.4KB)</span>
            </div>
            <div className="flex">
              <span className="text-red-500 mr-2">[10:45:32]</span>
              <span>Client disconnected: 7a9c42e5</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[10:45:32]</span>
              <span>Event 'system_stats' emitted (2.3KB)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsocketMonitoring;