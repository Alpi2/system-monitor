import React, { useState } from "react";
import { Activity, Database, CheckCircle, XCircle, Clock } from "lucide-react";
import { testMongoDBConnection } from "../api/systemApi";
import toast from "react-hot-toast";

interface TestingPanelProps {
  darkMode: boolean;
}

interface TestResult {
  name: string;
  status: "success" | "failure" | "pending";
  message?: string;
  timestamp: string;
  details?: Record<string, string | number>;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ darkMode }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [mongoUri, setMongoUri] = useState("mongodb://localhost:27017");

  const handleTestMongoDB = async () => {
    setTesting(true);

    // Add pending test result
    const pendingResult: TestResult = {
      name: "MongoDB Connection",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setTestResults((prev) => [pendingResult, ...prev]);

    try {
      const result = await testMongoDBConnection(mongoUri);

      // Update with success result
      const successResult: TestResult = {
        name: "MongoDB Connection",
        status: "success",
        message: result.message,
        details: result.details,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => [successResult, ...prev.slice(1)]);
      toast.success("MongoDB connection test successful");
    } catch (error) {
      // Update with failure result
      const failureResult: TestResult = {
        name: "MongoDB Connection",
        status: "failure",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => [failureResult, ...prev.slice(1)]);
      toast.error("MongoDB connection test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleApiTest = () => {
    setTesting(true);

    // Add pending test result
    const pendingResult: TestResult = {
      name: "API Response Time",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setTestResults((prev) => [pendingResult, ...prev]);

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        const successResult: TestResult = {
          name: "API Response Time",
          status: "success",
          message: "API endpoints responding within expected timeframes",
          details: {
            endpointsTested: 5,
            avgResponseTime: "68ms",
            slowestEndpoint: "/api/predict (125ms)",
            fastestEndpoint: "/api/health (12ms)",
          },
          timestamp: new Date().toISOString(),
        };

        setTestResults((prev) => [successResult, ...prev.slice(1)]);
        toast.success("API test completed successfully");
      } else {
        const failureResult: TestResult = {
          name: "API Response Time",
          status: "failure",
          message: "Some endpoints exceeded response time threshold",
          details: {
            endpointsTested: 5,
            failedEndpoints: 1,
            slowestEndpoint: "/api/predict (1250ms)",
          },
          timestamp: new Date().toISOString(),
        };

        setTestResults((prev) => [failureResult, ...prev.slice(1)]);
        toast.error("API test identified slow endpoints");
      }

      setTesting(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* MongoDB Connection Test */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
      >
        <div className="flex items-center mb-3">
          <Database size={18} className="mr-2 text-blue-500" />
          <h3 className="font-semibold">MongoDB Connection Test</h3>
        </div>

        <div className="mb-3">
          <label htmlFor="mongoUri" className="block text-sm mb-1">
            MongoDB Connection URI
          </label>
          <input
            id="mongoUri"
            type="text"
            value={mongoUri}
            onChange={(e) => setMongoUri(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            } border`}
            placeholder="mongodb://localhost:27017"
          />
        </div>

        <button
          onClick={handleTestMongoDB}
          disabled={testing}
          className={`flex items-center px-4 py-2 rounded ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {testing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
          ) : (
            <Database size={16} className="mr-2" />
          )}
          Test Connection
        </button>
      </div>

      {/* API Test */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
      >
        <div className="flex items-center mb-3">
          <Activity size={18} className="mr-2 text-green-500" />
          <h3 className="font-semibold">API Response Test</h3>
        </div>

        <p
          className={`text-sm mb-3 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Test API endpoint response times and error rates.
        </p>

        <button
          onClick={handleApiTest}
          disabled={testing}
          className={`flex items-center px-4 py-2 rounded ${
            darkMode
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {testing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
          ) : (
            <Activity size={16} className="mr-2" />
          )}
          Test API Performance
        </button>
      </div>

      {/* Test Results */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
      >
        <h3 className="font-semibold mb-3">Test Results</h3>

        <div className="space-y-3">
          {testResults.length === 0 ? (
            <div
              className={`text-center py-6 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No tests have been run yet. Run a test to see results here.
            </div>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? result.status === "success"
                      ? "bg-green-900 bg-opacity-20 border-l-4 border-green-500"
                      : result.status === "failure"
                      ? "bg-red-900 bg-opacity-20 border-l-4 border-red-500"
                      : "bg-gray-800 border-l-4 border-gray-500"
                    : result.status === "success"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : result.status === "failure"
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "bg-gray-100 border-l-4 border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    {result.status === "success" ? (
                      <CheckCircle
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      />
                    ) : result.status === "failure" ? (
                      <XCircle
                        size={18}
                        className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <Clock
                        size={18}
                        className="text-gray-500 mr-2 flex-shrink-0 mt-0.5 animate-pulse"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      {result.message && (
                        <p
                          className={`text-sm mt-1 ${
                            darkMode
                              ? result.status === "success"
                                ? "text-green-300"
                                : result.status === "failure"
                                ? "text-red-300"
                                : "text-gray-400"
                              : result.status === "success"
                              ? "text-green-700"
                              : result.status === "failure"
                              ? "text-red-700"
                              : "text-gray-500"
                          }`}
                        >
                          {result.message}
                        </p>
                      )}

                      {result.details && (
                        <div
                          className={`mt-2 text-xs p-2 rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          {Object.entries(result.details).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between mb-1 last:mb-0"
                              >
                                <span
                                  className={`${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                  :
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingPanel;
