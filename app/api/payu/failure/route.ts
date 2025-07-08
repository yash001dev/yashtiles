import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get form data from PayU
    const formData = await request.formData();
    const paymentData: Record<string, string> = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
      paymentData[key] = value.toString();
    });

    console.log('PayU Failure Response:', paymentData);

    // Store payment data temporarily (you might want to save to database here)
    // For now, we'll redirect to the failure page with query params
    const params = new URLSearchParams();
    Object.entries(paymentData).forEach(([key, value]) => {
      params.append(key, value);
    });

    // Redirect to failure page with payment data
    return NextResponse.redirect(new URL(`/failure?${params.toString()}`, request.url));
  } catch (error) {
    console.error('Error processing PayU failure response:', error);
    return NextResponse.redirect(new URL('/failure?error=processing_error', request.url));
  }
}

// Handle GET requests (in case of direct access)
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/failure', request.url));
}
