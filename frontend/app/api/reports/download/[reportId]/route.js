/**
 * Next.js API Route: Download Report
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function GET(request, { params }) {
  const { reportId } = await params;
  
  const backendUrl = process.env.INTERNAL_API_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     "http://localhost:8000";

  try {
    const response = await fetch(`${backendUrl}/api/reports/${reportId}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to download report' }));
      return Response.json(error, { status: response.status });
    }

    // Return blob data
    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment',
      },
    });
  } catch (error) {
    console.error('Backend connection error:', error);
    return Response.json(
      { error: 'Failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

