# MindMap Frontend

Interactive graph visualization of the SSR/SSG/CSR glossary terms.

## Features

- **Interactive Graph**: Visual representation of glossary terms and their relationships
- **Search & Filter**: Real-time search across terms and tags
- **Node Details**: Click on nodes to view detailed definitions and references
- **Relationship Mapping**: Edges connect terms with shared tags
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Cytoscape.js** - Graph visualization library
- **Cytoscape-cola** - Force-directed layout algorithm

## Development

```bash
# Install dependencies
npm install

# Start dev server (with API proxy)
npm run dev
# Frontend available at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## How It Works

### Graph Generation

1. Fetches glossary terms from the API
2. Creates nodes for each term
3. Creates edges between terms that share tags
4. Uses force-directed layout to position nodes

### Interactions

- **Click node**: View detailed information
- **Search**: Filter and highlight matching terms
- **Reset**: Return to default view
- **Zoom/Pan**: Navigate the graph

### Styling

- Nodes are color-coded:
  - Blue: Default state
  - Orange: Highlighted/searched
  - Red: Selected
- Edge thickness represents the number of shared tags

## Docker

```bash
# Build image
docker build -t mindmap-frontend .

# Run container
docker run -p 80:80 mindmap-frontend
```

## API Integration

The frontend expects the Glossary API to be available at `/api/*`. In development, Vite proxies these requests to `http://localhost:4000`. In production, nginx handles the proxy configuration.

## Environment Variables

No environment variables required. API endpoint is configured via proxy.

