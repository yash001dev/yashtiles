'use client';

import { useEffect, useState } from 'react';
import { debugContentModel } from '@/lib/contentful';

export default function DebugContentfulPage() {
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    setDebugOutput([]);
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const logs: string[] = [];

    console.log = (...args) => {
      logs.push(`[LOG] ${args.join(' ')}`);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`[ERROR] ${args.join(' ')}`);
      originalError(...args);
    };

    console.warn = (...args) => {
      logs.push(`[WARN] ${args.join(' ')}`);
      originalWarn(...args);
    };

    try {
      await debugContentModel();
    } catch (error) {
      logs.push(`[ERROR] Debug failed: ${error}`);
    }

    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    setDebugOutput(logs);
    setIsLoading(false);
  };

  useEffect(() => {
    runDebug();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Contentful Debug Console
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page helps diagnose issues with your Contentful integration.
              Check the output below to understand what might be wrong.
            </p>
            
            <button
              onClick={runDebug}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Running Debug...' : 'Run Debug Again'}
            </button>
          </div>

          {/* Environment Variables Check */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Environment Variables</h2>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <strong>SPACE_ID:</strong>{' '}
                {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ? (
                  <span className="text-green-600">
                    {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID.slice(0, 8)}...
                  </span>
                ) : (
                  <span className="text-red-600">NOT SET</span>
                )}
              </div>
              <div>
                <strong>ACCESS_TOKEN:</strong>{' '}
                {process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? (
                  <span className="text-green-600">
                    {process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN.slice(0, 8)}...
                  </span>
                ) : (
                  <span className="text-red-600">NOT SET</span>
                )}
              </div>
              <div>
                <strong>ENVIRONMENT:</strong>{' '}
                <span className="text-blue-600">
                  {process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'}
                </span>
              </div>
            </div>
          </div>

          {/* Debug Output */}
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            <h2 className="text-white text-lg font-semibold mb-3">Debug Output:</h2>
            {debugOutput.length === 0 && !isLoading && (
              <div className="text-gray-400">No output yet. Click "Run Debug" to start.</div>
            )}
            {isLoading && (
              <div className="text-yellow-400">Running diagnostics...</div>
            )}
            {debugOutput.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.includes('[ERROR]') ? 'text-red-400' :
                log.includes('[WARN]') ? 'text-yellow-400' :
                log.includes('✅') ? 'text-green-400' :
                log.includes('❌') ? 'text-red-400' :
                log.includes('⚠️') ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {log}
              </div>
            ))}
          </div>

          {/* Quick Setup Guide */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Quick Setup Checklist
            </h2>
            <div className="space-y-2 text-sm text-blue-800">
              <div>1. ✅ Create a Contentful account at contentful.com</div>
              <div>2. ✅ Create a new space for your project</div>
              <div>3. ✅ Create a content type called "product" (lowercase)</div>
              <div>4. ✅ Add required fields: productTitle, price, stockStatus, category, images, description</div>
              <div>5. ✅ Create and publish some product entries</div>
              <div>6. ✅ Get your Space ID and Content Delivery API token</div>
              <div>7. ✅ Add them to your .env.local file</div>
              <div>8. ✅ Restart your development server</div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 flex space-x-4">
            <a
              href="/products"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Products Page
            </a>
            <a
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}