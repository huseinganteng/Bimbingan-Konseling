// Test endpoint untuk memastikan API routes bekerja
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API routes bekerja dengan baik!',
    timestamp: new Date().toISOString()
  });
}

