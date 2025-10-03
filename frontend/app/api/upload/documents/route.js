/**
 * Next.js API Route: Upload Documents
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function POST(request) {
  const formData = await request.formData();
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${backendUrl}/api/upload/documents`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to upload documents' }));
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

