import React, { useRef, useState } from 'react';
import { Upload, Camera, Image } from 'lucide-react';

interface PhotoUploadProps {
  onImageSelect: (file: File) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="w-full max-w-md animate-fadeInUp">
        <div
          className={`relative bg-white rounded-3xl shadow-xl border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer group ${
            isDragOver 
              ? 'border-pink-400 bg-pink-50 scale-105' 
              : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50 hover:scale-105'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
            {/* Animated Icon */}
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragOver ? 'bg-pink-200 scale-110' : 'bg-pink-100 group-hover:bg-pink-200 group-hover:scale-110'
              }`}>
                <div className="relative">
                  <Camera size={32} className="text-pink-500 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-pink-600">
                Upload Your Photo
              </h3>
              <p className="text-gray-600 text-lg">
                Drag and drop or click to select
              </p>
              <p className="text-sm text-gray-500">
                PNG or JPEG files only • Max 10MB
              </p>
            </div>
            
            {/* Upload Button */}
            <div className="flex items-center justify-center space-x-3 text-pink-500 font-semibold">
              <Upload size={20} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="transition-colors duration-300 group-hover:text-pink-600">Choose Photo</span>
            </div>

            {/* Sample Images */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">Or try with sample images</p>
              <div className="flex justify-center space-x-2">
                {[
                  "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=100",
                  "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=100",
                  "https://images.pexels.com/photos/1090641/pexels-photo-1090641.jpeg?auto=compress&cs=tinysrgb&w=100"
                ].map((src, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Convert sample image to file for demo
                      fetch(src)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], `sample-${index}.jpg`, { type: 'image/jpeg' });
                          onImageSelect(file);
                        });
                    }}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-pink-400 transition-all duration-200 transform hover:scale-110"
                  >
                    <img src={src} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Animated Background */}
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
            isDragOver ? 'bg-pink-100 opacity-50' : 'bg-pink-50 opacity-0 group-hover:opacity-30'
          }`} />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <Image size={24} className="text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <Upload size={20} className="text-pink-400 animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PhotoUpload;