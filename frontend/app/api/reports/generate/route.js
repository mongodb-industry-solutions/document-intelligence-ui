/**
 * Next.js API Route: Generate Report
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function POST(request) {
  const body = await request.json();
  
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

  try {
    const response = await fetch(`${backendUrl}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to generate report' }));
      return Response.json(error, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Backend connection error:', error);
    return Response.json(
      { error: 'Failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

