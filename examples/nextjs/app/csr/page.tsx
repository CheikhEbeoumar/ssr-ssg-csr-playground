'use client';

import { useEffect, useState } from 'react';
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

export default function CSRPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTime, setFetchTime] = useState<string>('');

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/terms`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch terms');
        }

        const json = await res.json();
        setData(json);
        setFetchTime(new Date().toISOString());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Client-Side Rendering (CSR)
            </h1>
            <p className="text-gray-600 mb-4">
              This page renders in the browser. Data is fetched after the page loads.
            </p>
            {loading && (
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-gray-700">Loading data...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            )}
            {data && (
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Fetched at:</strong> {fetchTime}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Total Terms:</strong> {data.total}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Note: Check the Network tab in DevTools to see the API call made by the browser.
                </p>
              </div>
            )}
          </div>
        </div>

        {data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.terms.map((term) => (
              <div key={term.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-purple-600 mb-2">{term.term}</h2>
                <p className="text-gray-700 mb-4">{term.short_definition}</p>
                <div className="flex flex-wrap gap-2">
                  {term.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
