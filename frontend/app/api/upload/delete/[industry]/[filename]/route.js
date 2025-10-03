/**
 * Next.js API Route: Delete Uploaded Document
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function DELETE(request, { params }) {
  const { industry, filename } = await params;
  
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8080";

  try {
    const response = await fetch(`${backendUrl}/api/upload/documents/${industry}/${filename}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete document' }));
      return Response.json(error, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Backend connection error:', error);
    return Response.json(
      { error: 'Failed to delete document', details: error.message },
      { status: 500 }
    );
  }
}

