import React from 'react';
import Link from 'next/link';

export default function PayUFailurePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Failed</h1>
      <p className="mb-6">Sorry, your payment could not be processed. Please try again or contact support.</p>
      <Link href="/app" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">Back to Home</Link>
    </div>
  );
} 