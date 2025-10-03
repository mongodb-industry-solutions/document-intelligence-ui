/**
 * Next.js API Route: Download Seed Report
 * Proxies requests to backend to enable internal K8s service communication
 */

export async function GET(request, { params }) {
  const { industry, useCase } = await params;
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${backendUrl}/api/reports/seed/${industry}/${useCase}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to download seed report' }));
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

