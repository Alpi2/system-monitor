import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers, Play, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { fetchMLModels, testModel } from "../api/systemApi";
import toast from "react-hot-toast";

interface MLModelManagementProps {
  darkMode: boolean;
}

const MLModelManagement: React.FC<MLModelManagementProps> = ({ darkMode }) => {
  const [testingModelId, setTestingModelId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mlModels"],
    queryFn: fetchMLModels,
  });

  const handleTestModel = async (modelId: string) => {
    setTestingModelId(modelId);
    try {
      const result = await testModel(modelId);
      if (result.status === "success") {
        toast.success(`Model test successful: ${result.message}`);
      } else {
        toast.error(`Model test failed: ${result.message}`);
      }
    } catch (error) {
      toast.error("Failed to test model");
    } finally {
      setTestingModelId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        Loading ML models...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading ML models: {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div
          className={`flex items-center justify-between ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="flex items-center">
            <Layers size={18} className="mr-2" />
            <span>Total Models: {data?.models.length || 0}</span>
          </div>
          <div>
            <span className="flex items-center text-green-500 mr-4">
              <CheckCircle size={16} className="mr-1" />
              Active: {data?.models.filter((m) => m.active).length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data?.models.map((model) => (
          <div
            key={model.id}
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-white"
            } shadow-sm border-l-4 ${
              model.status === "training"
                ? "border-yellow-500"
                : model.status === "inference"
                ? "border-green-500"
                : "border-gray-300"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-3 md:mb-0">
                <div className="flex items-center">
                  <h4 className="font-semibold text-lg">{model.name}</h4>
                  {model.active && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500 text-white">
                      Active
                    </span>
                  )}
                </div>

                <div
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Type: {model.type}
                </div>

                <div className="flex items-center mt-2">
                  {model.status === "training" ? (
                    <span className="flex items-center text-yellow-500">
                      <AlertTriangle size={16} className="mr-1" />
                      Training
                    </span>
                  ) : model.status === "inference" ? (
                    <span className="flex items-center text-green-500">
                      <CheckCircle size={16} className="mr-1" />
                      Inference
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-1" />
                      Idle
                    </span>
                  )}
                  <span
                    className={`mx-3 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Last activity:{" "}
                    {new Date(model.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-sm mb-1">GPU Memory</div>
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        (model.gpuMemoryUsage / model.gpuMemoryTotal) * 100 > 80
                          ? "bg-red-500"
                          : (model.gpuMemoryUsage / model.gpuMemoryTotal) *
                              100 >
                            60
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          (model.gpuMemoryUsage / model.gpuMemoryTotal) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">
                    {model.gpuMemoryUsage} / {model.gpuMemoryTotal} GB
                  </div>
                </div>

                <button
                  onClick={() => handleTestModel(model.id)}
                  disabled={testingModelId !== null}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {testingModelId === model.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play size={16} className="mr-1" />
                      Test Model
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {!data?.models.length && (
          <div
            className={`p-6 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-white"
            } text-center`}
          >
            <Layers
              size={32}
              className={`mx-auto mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              No ML models found in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLModelManagement;
