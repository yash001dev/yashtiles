import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get form data from PayU
    const formData = await request.formData();
    const paymentData: Record<string, string> = {};

    // Convert FormData to object
    formData.forEach((value, key) => {
      paymentData[key] = value.toString();
    });

    console.log("PayU Success Response:", paymentData);

    // Store payment data temporarily (you might want to save to database here)
    // For now, we'll redirect to the success page with query params
    const params = new URLSearchParams();
    Object.entries(paymentData).forEach(([key, value]) => {
      params.append(key, value);
    });

    // Redirect to success page with payment data
    return NextResponse.redirect(
      new URL(`/success?${params.toString()}`, request.url)
    );
  } catch (error) {
    console.error("Error processing PayU success response:", error);
    return NextResponse.redirect(
      new URL("/success?error=processing_error", request.url)
    );
  }
}

// Handle GET requests (in case of direct access)
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/success", request.url));
}
