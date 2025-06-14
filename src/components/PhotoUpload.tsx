import React, { useRef } from 'react';
import { Upload, Camera } from 'lucide-react';

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div
        className="relative bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300 hover:border-pink-400 transition-colors duration-300 p-12 max-w-md w-full text-center cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
              <Camera size={32} className="text-pink-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Upload Your Photo
            </h3>
            <p className="text-gray-500">
              Drag and drop or click to select
            </p>
            <p className="text-sm text-gray-400">
              PNG or JPEG files only
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-pink-500">
            <Upload size={20} />
            <span className="font-medium">Choose Photo</span>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default PhotoUpload;