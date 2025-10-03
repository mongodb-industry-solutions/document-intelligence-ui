/**
 * Next.js API Route: Get Latest Report
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function GET(request, { params }) {
  const { industry, useCase } = await params;
  
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8000";

  try {
    const response = await fetch(`${backendUrl}/api/reports/latest/${industry}/${useCase}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(null, { status: 404 });
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch latest report' }));
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

