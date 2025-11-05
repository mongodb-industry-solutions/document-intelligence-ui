// Next.js API Route - Proxies ingestion start requests to backend
// This runs server-side where INTERNAL_API_URL is accessible

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Get backend URL from environment (server-side only)
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    console.log(`🔗 Proxying to backend: ${backendUrl}/api/ingestion/start`);
    
    // Forward request to backend
    const response = await fetch(`${backendUrl}/api/ingestion/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      return Response.json(error, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return Response.json(
      { error: 'Failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

