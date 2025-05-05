import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Zap, BarChart3 } from 'lucide-react';
import { fetchApiStats } from '../api/systemApi';

interface ApiMonitoringProps {
  darkMode: boolean;
}

const ApiMonitoring: React.FC<ApiMonitoringProps> = ({ darkMode }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['apiStats'],
    queryFn: fetchApiStats,
  });
  
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Loading API metrics...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading API metrics: {(error as Error).message}</div>;
  }
  
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className={`grid grid-cols-2 gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm mb-1">Total Requests</div>
          <div className="text-2xl font-semibold">{data?.totalRequests}</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm mb-1">Active Connections</div>
          <div className="text-2xl font-semibold">{data?.activeConnections}</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm mb-1">Requests/Min</div>
          <div className="text-2xl font-semibold">{data?.requestsPerMinute.toFixed(1)}</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm mb-1">Avg Response Time</div>
          <div className="text-2xl font-semibold">{data?.avgResponseTime} ms</div>
        </div>
      </div>
      
      {/* Status Codes Section */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-3">
          <BarChart3 size={18} className="mr-2 text-blue-500" />
          <h3 className="font-semibold">Status Codes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data && Object.entries(data.statusCodes).map(([code, count]) => (
            <div 
              key={code}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                code.startsWith('2') ? 'bg-green-100 text-green-800' :
                code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                code.startsWith('5') ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {code}
              <span className="ml-2 bg-white bg-opacity-30 px-1.5 rounded-full text-xs">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Endpoints Table */}
      <div>
        <div className="flex items-center mb-3">
          <Link size={18} className="mr-2 text-indigo-500" />
          <h3 className="font-semibold">Endpoint Activity</h3>
        </div>
        <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Endpoint</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Requests</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Avg Time</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              {data?.endpoints.map((endpoint, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-mono text-xs truncate max-w-[200px]" title={endpoint.path}>
                      {endpoint.path}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{endpoint.count}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={
                      endpoint.avgResponseTime > 200 ? 'text-red-500' :
                      endpoint.avgResponseTime > 100 ? 'text-yellow-500' :
                      'text-green-500'
                    }>
                      {endpoint.avgResponseTime} ms
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Rate Limiting Section */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-3">
          <Zap size={18} className="mr-2 text-yellow-500" />
          <h3 className="font-semibold">Rate Limiting Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm mb-1">Rate Limit Threshold</div>
            <div className="text-xl font-semibold">100 req/min</div>
            <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Current usage: {(data?.requestsPerMinute || 0) / 100 * 100}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full ${
                  (data?.requestsPerMinute || 0) / 100 > 0.8 ? 'bg-red-500' : 
                  (data?.requestsPerMinute || 0) / 100 > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                }`} 
                style={{ width: `${Math.min(((data?.requestsPerMinute || 0) / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-sm mb-1">Rejected Requests (429)</div>
            <div className="text-xl font-semibold">{data?.statusCodes['429'] || 0}</div>
            <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {((data?.statusCodes['429'] || 0) / (data?.totalRequests || 1) * 100).toFixed(2)}% of total requests
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="h-1.5 rounded-full bg-red-500" 
                style={{ width: `${Math.min(((data?.statusCodes['429'] || 0) / (data?.totalRequests || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiMonitoring;