// Next.js API Route - Proxies document upload requests to backend

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/upload/documents`, {
      method: 'POST',
      body: formData,
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

