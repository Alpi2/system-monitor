import React from 'react';
import { Activity, Terminal, Database, AlertCircle } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  return (
    <header className={`py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Activity size={28} className="text-blue-500 mr-2" />
          <h1 className="text-xl font-bold">SysMonitor</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <StatusIndicator 
            icon={<Terminal size={16} />} 
            label="Backend" 
            status="online" 
            darkMode={darkMode} 
          />
          <StatusIndicator 
            icon={<Database size={16} />} 
            label="Database" 
            status="online" 
            darkMode={darkMode} 
          />
          <StatusIndicator 
            icon={<AlertCircle size={16} />} 
            label="Alerts" 
            status="warning" 
            darkMode={darkMode} 
          />
        </div>
        
        <div className="text-xs md:text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last updated: </span>
          <span className="font-medium">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  );
};

interface StatusIndicatorProps {
  icon: React.ReactNode;
  label: string;
  status: 'online' | 'offline' | 'warning';
  darkMode: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ icon, label, status, darkMode }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {icon}
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
        <span className="text-xs capitalize">{status}</span>
      </div>
    </div>
  );
};

export default Header;