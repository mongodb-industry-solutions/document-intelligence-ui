/**
 * Next.js API Route: Documents List
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Server-side environment variable access
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8000";

  try {
    const queryString = searchParams.toString();
    const response = await fetch(`${backendUrl}/api/documents/list?${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch documents' }));
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

