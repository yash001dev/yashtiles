"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2, Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../../src/components/Header';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { NotificationProvider, useNotifications } from '../../src/contexts/NotificationContext';
import {API_BASE_URL} from '@/lib/auth';

interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
  guidanceScale?: number;
  steps?: number;
}

interface GenerateImageResponse {
  success: boolean;
  imageData: string;
  generationTime: number;
}

function AIDesignContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [isCreatingFrame, setIsCreatingFrame] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      addNotification({
        type: "warning",
        title: "Prompt Required",
        message: "Please enter a prompt to generate an image.",
      });
      return;
    }

    if (!isAuthenticated) {
      addNotification({
        type: "warning",
        title: "Authentication Required",
        message: "Please log in to use AI image generation.",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setGenerationTime(null);

    try {
      const requestData: GenerateImageRequest = {
        prompt: prompt.trim(),
        width: 1024,
        height: 1024,
        guidanceScale: 7.5,
        steps: 30,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data: GenerateImageResponse = await response.json();
      
      if (data.success) {
        setGeneratedImage(data.imageData);
        setGenerationTime(data.generationTime);
        addNotification({
          type: "success",
          title: "Image Generated!",
          message: `Your AI image was created in ${(data.generationTime / 1000).toFixed(1)}s`,
        });
      } else {
        throw new Error('Image generation failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      addNotification({
        type: "error",
        title: "Generation Failed",
        message: "Failed to generate image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateFrame = async () => {
    if (!generatedImage) return;

    setIsCreatingFrame(true);
    
    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], 'ai-generated-image.png', { type: 'image/png' });
      
      // Store the image in localStorage or sessionStorage for the frame playground
      const imageUrl = URL.createObjectURL(file);
      
      // Navigate to frame playground with the generated image
      router.push('/frame?aiImage=' + encodeURIComponent(imageUrl));
      
      addNotification({
        type: "success",
        title: "Frame Created!",
        message: "Your AI image is ready for framing.",
      });
    } catch (error) {
      console.error('Error creating frame:', error);
      addNotification({
        type: "error",
        title: "Frame Creation Failed",
        message: "Failed to create frame. Please try again.",
      });
    } finally {
      setIsCreatingFrame(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
              <Wand2 className="w-8 h-8 text-pink-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Design with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into stunning artwork with our AI-powered image generator. 
            Create unique designs and turn them into beautiful frames.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Wand2 className="w-6 h-6 text-purple-500 mr-3" />
                Create Your Design
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your image
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A serene mountain landscape at sunset with golden clouds..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                    isGenerating || !prompt.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating your image...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Image</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be specific about colors, style, and mood</li>
                <li>• Mention artistic styles like "oil painting" or "watercolor"</li>
                <li>• Include lighting details like "golden hour" or "dramatic shadows"</li>
                <li>• Specify composition like "wide shot" or "close-up"</li>
              </ul>
            </div>
          </div>

          {/* Generated Image Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-300 rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Creating your masterpiece...</h3>
                    <p className="text-sm text-gray-500">This usually takes 10-30 seconds</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-4">
                  <div className="relative group">
                    <img
                      src={generatedImage}
                      alt="AI Generated"
                      className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {generationTime && (
                    <div className="text-center text-sm text-gray-500">
                      Generated in {(generationTime / 1000).toFixed(1)} seconds
                    </div>
                  )}
                  
                  <button
                    onClick={handleCreateFrame}
                    disabled={isCreatingFrame}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {isCreatingFrame ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Frame...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Frame</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold">Your generated image will appear here</h3>
                    <p className="text-sm">Enter a prompt and click generate to get started</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">AI Powered</h4>
                <p className="text-xs text-gray-500">Advanced image generation</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ImageIcon className="w-4 h-4 text-pink-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Instant Frames</h4>
                <p className="text-xs text-gray-500">Turn into beautiful frames</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIDesignPage() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AIDesignContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default AIDesignPage; 