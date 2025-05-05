import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import HardwareMonitoring from './components/HardwareMonitoring';
import ProcessList from './components/ProcessList';
import MLModelManagement from './components/MLModelManagement';
import ApiMonitoring from './components/ApiMonitoring';
import WebsocketMonitoring from './components/WebsocketMonitoring';
import CleanupTools from './components/CleanupTools';
import TestingPanel from './components/TestingPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 10000, // Refetch data every 10 seconds
      staleTime: 5000,
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    hardware: true,
    processes: false,
    mlModels: true,
    api: true,
    websocket: false,
    cleanup: false,
    testing: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
        <Header darkMode={darkMode} />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">System Monitoring Dashboard</h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hardware Monitoring Section */}
            <section className={`col-span-1 md:col-span-2 lg:col-span-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('hardware')}
              >
                <h2 className="text-xl font-semibold">Hardware Monitoring</h2>
                {expandedSections.hardware ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.hardware && (
                <div className="p-4 pt-0">
                  <HardwareMonitoring darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* Processes Section */}
            <section className={`col-span-1 md:col-span-2 lg:col-span-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('processes')}
              >
                <h2 className="text-xl font-semibold">Active Processes</h2>
                {expandedSections.processes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.processes && (
                <div className="p-4 pt-0">
                  <ProcessList darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* ML Model Management Section */}
            <section className={`col-span-1 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('mlModels')}
              >
                <h2 className="text-xl font-semibold">ML Model Management</h2>
                {expandedSections.mlModels ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.mlModels && (
                <div className="p-4 pt-0">
                  <MLModelManagement darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* API Monitoring Section */}
            <section className={`col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('api')}
              >
                <h2 className="text-xl font-semibold">API Monitoring</h2>
                {expandedSections.api ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.api && (
                <div className="p-4 pt-0">
                  <ApiMonitoring darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* WebSocket Monitoring Section */}
            <section className={`col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('websocket')}
              >
                <h2 className="text-xl font-semibold">WebSocket Monitoring</h2>
                {expandedSections.websocket ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.websocket && (
                <div className="p-4 pt-0">
                  <WebsocketMonitoring darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* Cleanup Tools Section */}
            <section className={`col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('cleanup')}
              >
                <h2 className="text-xl font-semibold">Cleanup & Maintenance</h2>
                {expandedSections.cleanup ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.cleanup && (
                <div className="p-4 pt-0">
                  <CleanupTools darkMode={darkMode} />
                </div>
              )}
            </section>
            
            {/* Testing Panel Section */}
            <section className={`col-span-1 md:col-span-2 lg:col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('testing')}
              >
                <h2 className="text-xl font-semibold">Testing & Debug</h2>
                {expandedSections.testing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.testing && (
                <div className="p-4 pt-0">
                  <TestingPanel darkMode={darkMode} />
                </div>
              )}
            </section>
          </div>
        </main>
        
        <footer className={`py-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2025 System Monitoring Dashboard. All data refreshes automatically.</p>
        </footer>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;