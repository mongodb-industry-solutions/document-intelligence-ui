// Next.js API Route - Proxies report download requests to backend

export async function GET(request, { params }) {
  try {
    const { reportId } = params;
    
    const backendUrl = process.env.INTERNAL_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       "http://localhost:8080";
    
    const response = await fetch(`${backendUrl}/api/reports/${reportId}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    // Return blob for download
    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/pdf');
    headers.set('Content-Disposition', response.headers.get('Content-Disposition') || `attachment; filename="report-${reportId}.pdf"`);
    
    return new Response(blob, { headers });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return Response.json(
      { error: 'Failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

