// Next.js API Route - Proxies seed report preview requests to backend

export async function GET(request, { params }) {
  try {
    const { industry, useCase } = params;
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/reports/seed/${industry}/${useCase}/preview`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    // Pass through the response (could be PDF, HTML, or JSON)
    const contentType = response.headers.get('Content-Type');
    const body = await response.arrayBuffer();
    
    const headers = new Headers();
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    
    return new Response(body, { headers });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return Response.json(
      { error: 'Failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

