# Next.js Rendering Examples

This directory contains examples demonstrating different rendering strategies in Next.js App Router.

## Pages

- **`/`** - Home page with links to each example
- **`/ssr`** - Server-Side Rendering example
- **`/ssg`** - Static Site Generation example
- **`/csr`** - Client-Side Rendering example

## Rendering Methods

### Server-Side Rendering (SSR)
- **File**: `app/ssr/page.tsx`
- **Strategy**: `cache: 'no-store'` in fetch
- **Behavior**: Rendered on the server for each request
- **Use case**: Dynamic content that changes frequently

### Static Site Generation (SSG)
- **File**: `app/ssg/page.tsx`
- **Strategy**: `cache: 'force-cache'` in fetch
- **Behavior**: Pre-rendered at build time
- **Use case**: Content that doesn't change often

### Client-Side Rendering (CSR)
- **File**: `app/csr/page.tsx`
- **Strategy**: `'use client'` directive with useEffect
- **Behavior**: Rendered in the browser after page load
- **Use case**: Highly interactive content

## Development

```bash
# Install dependencies
npm install

# Set API URL (optional)
export NEXT_PUBLIC_API_URL=http://localhost:4000

# Run development server
npm run dev
# Open http://localhost:3000
```

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Docker

```bash
# Build image
docker build -t nextjs-example .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://glossary-api:4000 nextjs-example
```

## Key Features

- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Next.js 15**: Latest App Router features
- **Performance**: Optimized builds with standalone output

## Observing Rendering Methods

### SSR
1. Visit `/ssr`
2. Note the "Rendered at" timestamp
3. Refresh the page - timestamp updates on each request
4. View page source - HTML is fully rendered

### SSG
1. Visit `/ssg`
2. Note the "Built at" timestamp
3. Refresh the page - timestamp stays the same (set at build time)
4. View page source - HTML is fully rendered

### CSR
1. Visit `/csr`
2. Open DevTools Network tab
3. See the API call made by the browser
4. View page source - minimal HTML, data loaded by JavaScript

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Glossary API endpoint (default: http://localhost:4000)
- `NODE_ENV`: Environment (development/production)
