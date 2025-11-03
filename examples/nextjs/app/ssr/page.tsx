import Link from 'next/link';

interface Term {
  id: string;
  term: string;
  short_definition: string;
  long_definition: string;
  tags: string[];
  sources: string[];
}

interface ApiResponse {
  terms: Term[];
  total: number;
}

async function getTerms(): Promise<ApiResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${apiUrl}/api/terms`, {
    cache: 'no-store', // Disable caching for SSR
  });

  if (!res.ok) {
    throw new Error('Failed to fetch terms');
  }

  return res.json();
}

export default async function SSRPage() {
  const data = await getTerms();
  const renderTime = new Date().toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Server-Side Rendering (SSR)
            </h1>
            <p className="text-gray-600 mb-4">
              This page is rendered on the server for every request. Data is always fresh.
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Rendered at:</strong> {renderTime}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Total Terms:</strong> {data.total}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.terms.map((term) => (
            <div key={term.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{term.term}</h2>
              <p className="text-gray-700 mb-4">{term.short_definition}</p>
              <div className="flex flex-wrap gap-2">
                {term.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
