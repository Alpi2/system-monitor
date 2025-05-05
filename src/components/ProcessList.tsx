import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, Search, XCircle } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatters';
import { fetchProcesses, stopProcess } from '../api/systemApi';
import toast from 'react-hot-toast';

interface ProcessListProps {
  darkMode: boolean;
}

const ProcessList: React.FC<ProcessListProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'cpu' | 'memory' | 'name'>('cpu');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['processes'],
    queryFn: fetchProcesses,
  });

  const handleSortChange = (field: 'cpu' | 'memory' | 'name') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const handleStopProcess = async (pid: number) => {
    try {
      const result = await stopProcess(pid);
      if (result.status === 'success') {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to stop process');
    }
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Loading process data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading processes: {(error as Error).message}</div>;
  }

  const filteredProcesses = data?.processes.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    proc.pid.toString().includes(searchTerm)
  ) || [];

  const sortedProcesses = [...filteredProcesses].sort((a, b) => {
    if (sortBy === 'cpu') {
      return sortDirection === 'asc' ? a.cpu_percent - b.cpu_percent : b.cpu_percent - a.cpu_percent;
    } else if (sortBy === 'memory') {
      return sortDirection === 'asc' ? a.memory_percent - b.memory_percent : b.memory_percent - a.memory_percent;
    } else {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or PID..."
            className={`pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            }`}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleSortChange('cpu')}
            className={`px-3 py-1 rounded flex items-center text-sm ${
              sortBy === 'cpu' 
                ? 'bg-blue-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            CPU
            {sortBy === 'cpu' && (
              <ArrowUpDown size={14} className="ml-1" />
            )}
          </button>
          <button
            onClick={() => handleSortChange('memory')}
            className={`px-3 py-1 rounded flex items-center text-sm ${
              sortBy === 'memory' 
                ? 'bg-blue-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Memory
            {sortBy === 'memory' && (
              <ArrowUpDown size={14} className="ml-1" />
            )}
          </button>
          <button
            onClick={() => handleSortChange('name')}
            className={`px-3 py-1 rounded flex items-center text-sm ${
              sortBy === 'name' 
                ? 'bg-blue-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Name
            {sortBy === 'name' && (
              <ArrowUpDown size={14} className="ml-1" />
            )}
          </button>
        </div>
      </div>
      
      <div className={`overflow-x-auto rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">PID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CPU %</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Memory %</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Started</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
            {sortedProcesses.map((process) => (
              <tr key={process.pid} className={`transition-colors hover:${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{process.pid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="truncate max-w-xs" title={process.name}>
                    {process.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${process.status === 'running' 
                      ? 'bg-green-100 text-green-800' 
                      : process.status === 'sleeping'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {process.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          process.cpu_percent > 60 ? 'bg-red-500' : 
                          process.cpu_percent > 30 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${Math.min(process.cpu_percent, 100)}%` }}
                      ></div>
                    </div>
                    <span>{process.cpu_percent.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          process.memory_percent > 60 ? 'bg-red-500' : 
                          process.memory_percent > 30 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${Math.min(process.memory_percent, 100)}%` }}
                      ></div>
                    </div>
                    <span>{process.memory_percent.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatTimeAgo(process.create_time * 1000)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{process.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleStopProcess(process.pid)}
                    className="text-red-500 hover:text-red-700 transition-colors text-xs"
                  >
                    Stop
                  </button>
                </td>
              </tr>
            ))}
            {sortedProcesses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                  No processes found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessList;