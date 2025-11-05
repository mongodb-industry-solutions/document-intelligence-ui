// Next.js API Route - Proxies Q&A thinking logs requests to backend

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/qa/logs/${sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return Response.json({ logs: [] });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ logs: [] });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { sessionId } = params;
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/qa/logs/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return Response.json({ success: false });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false });
  }
}

