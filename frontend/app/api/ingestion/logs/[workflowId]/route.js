/**
 * Next.js API Route: Get Ingestion Logs
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function GET(request, { params }) {
  const { workflowId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '200';
  
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

  try {
    const response = await fetch(`${backendUrl}/api/ingestion/logs/${workflowId}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Return empty logs on failure
      return Response.json({ logs: [] });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Backend connection error:', error);
    return Response.json({ logs: [] });
  }
}

