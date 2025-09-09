import React, { useCallback } from 'react';
import { Upload, File } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (url: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please upload a GLB file');
      return;
    }

    setIsLoading(true);
    const url = URL.createObjectURL(file);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      onFileUpload(url);
      setIsLoading(false);
    }, 500);
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-white">Import 3D Model</h2>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-400/10' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-white font-medium text-sm">
              {isLoading ? 'Loading model...' : 'Drop GLB file here'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              or click to browse
            </p>
          </div>
          
          <input
            type="file"
            accept=".glb"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          
          <label
            htmlFor="file-upload"
            className={`
              inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium cursor-pointer text-sm
              transition-colors duration-200
              ${isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 active:bg-blue-800'
              }
            `}
          >
            <File className="w-3 h-3 mr-1" />
            Choose File
          </label>
        </div>
      </div>
    </div>
  );
};