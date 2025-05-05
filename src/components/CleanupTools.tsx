import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Trash2,
  HardDrive,
  FolderOpen,
  AlertCircle,
  FileWarning,
} from "lucide-react";
import { fetchLargeFiles, runCleanup } from "../api/systemApi";
import { formatBytes, formatDate } from "../utils/formatters";
import toast from "react-hot-toast";

interface CleanupToolsProps {
  darkMode: boolean;
}

const CleanupTools: React.FC<CleanupToolsProps> = ({ darkMode }) => {
  const [cleaningUp, setCleaningUp] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["largeFiles"],
    queryFn: () => fetchLargeFiles(100, "/"),
  });

  const handleCleanup = async (target: string) => {
    setCleaningUp(target);
    try {
      const result = await runCleanup(target);
      if (result.status === "success") {
        toast.success(
          `Cleaned up ${target}: ${formatBytes(
            result.details?.bytesRemoved || 0
          )} removed`
        );
        refetch();
      } else {
        toast.error(`Cleanup failed: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Error during cleanup: ${(error as Error).message}`);
    } finally {
      setCleaningUp(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        Loading storage data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading storage data: {(error as Error).message}
      </div>
    );
  }

  // Calculate total used space
  const totalUsed = data?.files.reduce((acc, file) => acc + file.size, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Storage Overview */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
      >
        <div className="flex items-center mb-3">
          <HardDrive size={18} className="mr-2 text-purple-500" />
          <h3 className="font-semibold">Storage Overview</h3>
        </div>

        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
            <div
              className={`h-2.5 rounded-full ${
                totalUsed > 1024 * 1024 * 1024 * 800
                  ? "bg-red-500"
                  : totalUsed > 1024 * 1024 * 1024 * 600
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (totalUsed / (1024 * 1024 * 1024 * 1000)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className="text-sm whitespace-nowrap">
            {formatBytes(totalUsed)} / 1 TB
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => handleCleanup("logs")}
            disabled={cleaningUp !== null}
            className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {cleaningUp === "logs" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Clean Logs
          </button>
          <button
            onClick={() => handleCleanup("temp")}
            disabled={cleaningUp !== null}
            className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {cleaningUp === "temp" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Clean Temp
          </button>
          <button
            onClick={() => handleCleanup("cache")}
            disabled={cleaningUp !== null}
            className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {cleaningUp === "cache" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Clean Cache
          </button>
          <button
            onClick={() => refetch()}
            disabled={isLoading || cleaningUp !== null}
            className={`flex items-center justify-center py-2 px-3 rounded text-sm ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
            ) : (
              <FolderOpen size={16} className="mr-2" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Warning Section */}
      {data?.files.length &&
        data.files.some((file) => file.size > 1024 * 1024 * 1000) && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-amber-900 bg-opacity-30" : "bg-amber-50"
            } border-l-4 border-amber-500`}
          >
            <div className="flex items-start">
              <AlertCircle
                size={20}
                className="mr-3 text-amber-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-amber-500">Storage Warning</h4>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-amber-200" : "text-amber-700"
                  }`}
                >
                  There are very large files that may impact system performance.
                  Consider moving them to external storage or backup.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Large Files Section */}
      <div>
        <div className="flex items-center mb-3">
          <FileWarning size={18} className="mr-2 text-orange-500" />
          <h3 className="font-semibold">Large Files (&gt;100 MB)</h3>
        </div>

        <div
          className={`rounded-lg overflow-hidden ${
            darkMode ? "bg-gray-700" : "bg-white"
          } shadow-sm`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  File Path
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Modified
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-600" : "divide-gray-200"
              }`}
            >
              {data?.files.map((file, index) => (
                <tr
                  key={index}
                  className={`${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-4 py-3 text-sm">
                    <div
                      className="font-mono text-xs truncate max-w-[200px]"
                      title={file.path}
                    >
                      {file.path}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatBytes(file.size)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(file.modified)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        file.type === "directory"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {file.type}
                    </span>
                  </td>
                </tr>
              ))}

              {!data?.files.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No large files found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CleanupTools;
