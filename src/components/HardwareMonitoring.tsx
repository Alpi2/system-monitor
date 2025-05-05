import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Cpu, HardDrive, MemoryStick as Memory, Wifi } from 'lucide-react';
import { fetchSystemStats } from '../api/systemApi';
import { formatBytes } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface HardwareMonitoringProps {
  darkMode: boolean;
}

const HardwareMonitoring: React.FC<HardwareMonitoringProps> = ({ darkMode }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['systemStats'],
    queryFn: fetchSystemStats,
    refetchInterval: 2000, // More frequent updates for hardware monitoring
  });

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Loading hardware metrics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading hardware metrics: {(error as Error).message}</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#374151' : '#ffffff',
        titleColor: darkMode ? '#ffffff' : '#000000',
        bodyColor: darkMode ? '#e5e7eb' : '#374151',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#4b5563' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      y: {
        grid: {
          color: darkMode ? '#4b5563' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
    },
  };

  // CPU data for doughnut chart
  const cpuData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: [data?.cpu.usage, 100 - (data?.cpu.usage || 0)],
        backgroundColor: [
          data?.cpu.usage && data.cpu.usage > 80 ? '#ef4444' : data?.cpu.usage && data.cpu.usage > 60 ? '#f59e0b' : '#3b82f6',
          darkMode ? '#374151' : '#e5e7eb',
        ],
        borderColor: darkMode ? '#1f2937' : '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Memory data for doughnut chart
  const memoryData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: [data?.memory.percent, 100 - (data?.memory.percent || 0)],
        backgroundColor: [
          data?.memory.percent && data.memory.percent > 80 ? '#ef4444' : data?.memory.percent && data.memory.percent > 60 ? '#f59e0b' : '#10b981',
          darkMode ? '#374151' : '#e5e7eb',
        ],
        borderColor: darkMode ? '#1f2937' : '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Disk data for doughnut chart
  const diskData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: [data?.disk.percent, 100 - (data?.disk.percent || 0)],
        backgroundColor: [
          data?.disk.percent && data.disk.percent > 80 ? '#ef4444' : data?.disk.percent && data.disk.percent > 60 ? '#f59e0b' : '#8b5cf6',
          darkMode ? '#374151' : '#e5e7eb',
        ],
        borderColor: darkMode ? '#1f2937' : '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Label generator for core usage
  const coreLabels = Array.from({ length: data?.cpu.coreUsage?.length || 0 }, (_, i) => `Core ${i + 1}`);

  // CPU cores data for line chart
  const coreData = {
    labels: coreLabels,
    datasets: [
      {
        label: 'Core Usage %',
        data: data?.cpu.coreUsage || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const getStatusColor = (percent: number) => {
    if (percent > 80) return 'text-red-500';
    if (percent > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Usage Card */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Cpu className="text-blue-500 mr-2" size={20} />
              <h3 className="font-semibold">CPU Usage</h3>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(data?.cpu.usage || 0)}`}>
              {data?.cpu.usage}%
            </div>
          </div>
          <div className="h-48">
            <Doughnut data={cpuData} options={chartOptions} />
          </div>
          <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span className={data?.cpu.temperature && data.cpu.temperature > 70 ? 'text-red-500' : ''}>
                {data?.cpu.temperature}°C
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Cores:</span>
              <span>{data?.cpu.coreCount}</span>
            </div>
          </div>
        </div>

        {/* Memory Usage Card */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Memory className="text-green-500 mr-2" size={20} />
              <h3 className="font-semibold">Memory Usage</h3>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(data?.memory.percent || 0)}`}>
              {data?.memory.percent}%
            </div>
          </div>
          <div className="h-48">
            <Doughnut data={memoryData} options={chartOptions} />
          </div>
          <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{formatBytes(data?.memory.used || 0)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total:</span>
              <span>{formatBytes(data?.memory.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Disk Usage Card */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HardDrive className="text-purple-500 mr-2" size={20} />
              <h3 className="font-semibold">Disk Usage</h3>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(data?.disk.percent || 0)}`}>
              {data?.disk.percent}%
            </div>
          </div>
          <div className="h-48">
            <Doughnut data={diskData} options={chartOptions} />
          </div>
          <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{formatBytes(data?.disk.used || 0)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total:</span>
              <span>{formatBytes(data?.disk.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network & GPU Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Core Usage Chart */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center mb-4">
            <Cpu className="text-blue-500 mr-2" size={20} />
            <h3 className="font-semibold">CPU Core Usage</h3>
          </div>
          <div className="h-64">
            <Line data={coreData} options={chartOptions} />
          </div>
        </div>

        {/* Network Stats */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center mb-4">
            <Wifi className="text-indigo-500 mr-2" size={20} />
            <h3 className="font-semibold">Network Activity</h3>
          </div>
          <div className="space-y-4">
            <div className={`grid grid-cols-2 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="text-sm mb-1">Download</div>
                <div className="text-xl font-semibold">{formatBytes(data?.network.receivedSpeed || 0)}/s</div>
                <div className="text-xs mt-2">Total: {formatBytes(data?.network.received || 0)}</div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="text-sm mb-1">Upload</div>
                <div className="text-xl font-semibold">{formatBytes(data?.network.sentSpeed || 0)}/s</div>
                <div className="text-xs mt-2">Total: {formatBytes(data?.network.sent || 0)}</div>
              </div>
            </div>

            {/* GPU Stats if available */}
            {data?.gpu && data.gpu.length > 0 && (
              <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="font-medium mb-2">GPU: {data.gpu[0].name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="mb-1">Temperature</div>
                    <div className={`font-semibold ${data.gpu[0].temperature > 80 ? 'text-red-500' : data.gpu[0].temperature > 70 ? 'text-yellow-500' : ''}`}>
                      {data.gpu[0].temperature}°C
                    </div>
                  </div>
                  <div>
                    <div className="mb-1">Utilization</div>
                    <div className="font-semibold">{data.gpu[0].utilization}%</div>
                  </div>
                  <div>
                    <div className="mb-1">Memory Used</div>
                    <div className="font-semibold">{data.gpu[0].memory.used} MB ({data.gpu[0].memory.percent}%)</div>
                  </div>
                  <div>
                    <div className="mb-1">Memory Total</div>
                    <div className="font-semibold">{data.gpu[0].memory.total} MB</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareMonitoring;