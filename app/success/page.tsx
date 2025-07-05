import React from 'react';
import Link from 'next/link';

export default function PayUSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. Your payment was successful.</p>
      <Link href="/app" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">Back to Home</Link>
    </div>
  );
} 