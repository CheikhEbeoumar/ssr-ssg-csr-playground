import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-600">
          Next.js Rendering Examples
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore different rendering methods in Next.js
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/ssr" className="block p-6 bg-blue-50 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2 text-blue-600">SSR</h2>
            <p className="text-gray-700 mb-4">Server-Side Rendering</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Rendered on each request</li>
              <li>✓ Always fresh data</li>
              <li>✓ Good for SEO</li>
              <li>✓ Higher server load</li>
            </ul>
          </Link>

          <Link href="/ssg" className="block p-6 bg-green-50 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2 text-green-600">SSG</h2>
            <p className="text-gray-700 mb-4">Static Site Generation</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Built at build time</li>
              <li>✓ Fastest performance</li>
              <li>✓ CDN cacheable</li>
              <li>✓ Static content</li>
            </ul>
          </Link>

          <Link href="/csr" className="block p-6 bg-purple-50 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2 text-purple-600">CSR</h2>
            <p className="text-gray-700 mb-4">Client-Side Rendering</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Rendered in browser</li>
              <li>✓ Interactive</li>
              <li>✓ Lower server load</li>
              <li>✓ Slower initial load</li>
            </ul>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About These Examples</h3>
          <p className="text-gray-600">
            Each example fetches glossary terms from the API using different rendering strategies.
            Open your browser&apos;s DevTools Network tab to observe the differences in data fetching patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
