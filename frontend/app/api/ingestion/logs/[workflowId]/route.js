// Next.js API Route - Proxies ingestion logs requests to backend

export async function GET(request, { params }) {
  try {
    const { workflowId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '200';
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/ingestion/logs/${workflowId}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Return empty logs on error instead of failing
      return Response.json({ logs: [] });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return Response.json({ logs: [] });
  }
}

