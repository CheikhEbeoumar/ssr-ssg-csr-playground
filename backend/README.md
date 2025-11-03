# Glossary API Service

A RESTful API service providing access to a curated glossary of SSR, SSG, and CSR related terminology.

## Features

- RESTful endpoints for term lookup and search
- Fast and lightweight (Fastify framework)
- CORS enabled for cross-origin requests
- Docker support for easy deployment

## Installation

```bash
npm install
```

## Running Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:4000`

## Running with Docker

```bash
# Build the Docker image
docker build -t glossary-service -f Dockerfile ..

# Run the container
docker run -p 4000:4000 glossary-service
```

## API Endpoints

### Health Check
```
GET /
```

Returns service status and term count.

**Response:**
```json
{
  "service": "Glossary API",
  "version": "1.0.0",
  "status": "running",
  "terms": 26
}
```

### Get All Terms
```
GET /api/terms
```

Returns all glossary terms.

**Response:**
```json
{
  "terms": [...],
  "total": 26
}
```

### Get Term by ID
```
GET /api/terms/:id
```

Returns a specific term by its ID.

**Example:**
```bash
curl http://localhost:4000/api/terms/ssr
```

**Response:**
```json
{
  "id": "ssr",
  "term": "SSR (Server-Side Rendering)",
  "short_definition": "Rendering HTML on the server for each request",
  "long_definition": "...",
  "sources": [...],
  "tags": [...]
}
```

### Search Terms
```
GET /api/search?q=query
```

Search terms by keyword in term name, definitions, or tags.

**Example:**
```bash
curl http://localhost:4000/api/search?q=rendering
```

**Response:**
```json
{
  "query": "rendering",
  "results": [...],
  "count": 8
}
```

## Testing

```bash
# Start the server first
npm start

# In another terminal, run tests
npm test
```

## Data Structure

Each term in the glossary includes:

- `id`: Unique identifier (string)
- `term`: Full term name
- `short_definition`: Brief explanation
- `long_definition`: Detailed explanation
- `sources`: Array of reference URLs
- `tags`: Array of related tags/categories

## Environment Variables

- `PORT`: Server port (default: 4000)
- `HOST`: Server host (default: 0.0.0.0)
- `NODE_ENV`: Environment mode (development/production)
