/**
 * Next.js API Route: Cleanup Orphaned Reports
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function POST(request) {
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

  try {
    const response = await fetch(`${backendUrl}/api/reports/cleanup-orphaned`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to cleanup orphaned reports' }));
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

