// Next.js API Route - Proxies document view requests to backend

export async function GET(request, { params }) {
  try {
    const { documentId } = params;
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/documents/${documentId}/view`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    // Pass through the response (could be PDF, HTML, or other content)
    const contentType = response.headers.get('Content-Type');
    const body = await response.arrayBuffer();
    
    const headers = new Headers();
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    
    // Copy other relevant headers
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition);
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

