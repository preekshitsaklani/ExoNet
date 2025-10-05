import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'ExoNET Classification API',
    version: '2.0',
    timestamp: new Date().toISOString(),
    model: {
      loaded: true,
      type: 'Intelligent Heuristic Classifier',
      features: 20,
      capabilities: [
        'Exoplanet classification',
        'Confidence scoring',
        'Feature importance analysis',
        'Cross-mission validation'
      ]
    }
  });
}