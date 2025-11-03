# Experimental Playground for Comparing SSR, SSG and CSR

## Overview

This repository is an experimental playground for studying and comparing different rendering methods in modern web frameworks:
- **SSR** (Server-Side Rendering)
- **SSG** (Static Site Generation)
- **CSR** (Client-Side Rendering)

## Thesis

"Study of rendering methods SSR, SSG and CSR in web frameworks"

## Project Structure

```
.
├── backend/          # Glossary API service (Phase A)
├── frontend/         # MindMap visualization interface (Phase B)
├── examples/         # Framework examples (Phase B)
│   ├── nextjs/      # Next.js examples (SSR, SSG, CSR)
│   ├── nuxtjs/      # Nuxt.js documentation
│   ├── sveltekit/   # SvelteKit documentation
│   └── astro/       # Astro documentation
├── benchmarks/       # Performance measurement tools (Phase C)
│   ├── runner/      # Lighthouse benchmark runner
│   ├── dashboard/   # Metrics visualization dashboard
│   └── results/     # Benchmark results
├── docs/            # Documentation and glossary data
└── docker-compose.yml
```

## Features

### ✅ Phase A: Glossary API
- **26 curated terms** covering SSR, SSG, CSR and related concepts
- **RESTful API** for term lookup and search
- **Dockerized service** with health checks
- **Comprehensive testing** with 6 unit tests

### ✅ Phase B: Interactive MindMap & Examples

#### MindMap Frontend
- **Interactive graph visualization** using Cytoscape.js
- **26 nodes** representing glossary terms
- **Dynamic edges** connecting related terms (shared tags)
- **Search & filter** functionality
- **Detailed term view** with definitions and references
- **Responsive design** for desktop and mobile

#### Framework Examples
- **Next.js** (React): Fully implemented
  - SSR page with `cache: 'no-store'`
  - SSG page with `cache: 'force-cache'`
  - CSR page with `'use client'` directive
  - TypeScript + Tailwind CSS
- **Nuxt.js** (Vue): Documented patterns
- **SvelteKit** (Svelte): Documented patterns
- **Astro**: Documented patterns

### ✅ Phase C: Benchmarking

#### Benchmark Runner
- **Lighthouse-based** automated performance testing
- **Core Web Vitals** collection (TTFB, FCP, LCP, CLS)
- **Additional metrics**: TBT, SI, TTI, Performance Score
- **JSON output** for analysis and visualization
- **Configurable targets** and test parameters

#### Metrics Dashboard
- **Web-based interface** for visualizing results
- **Real-time updates** and auto-refresh
- **Comparison tables** across rendering methods
- **Interactive charts** (Bar and Radar)
- **Historical results** tracking

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional, for containerized deployment)

### Quick Start

#### 1. Clone and Setup
```bash
git clone https://github.com/CheikhEbeoumar/ssr-ssg-csr-playground.git
cd ssr-ssg-csr-playground
```

#### 2. Start with Docker Compose (Recommended)
```bash
docker-compose up --build
```

Services available:
- **Glossary API**: http://localhost:4000
- **MindMap Frontend**: http://localhost:5173

#### 3. Or Run Locally

**Backend (Glossary API):**
```bash
cd backend
npm install
npm start
# API available at http://localhost:4000
```

**Frontend (MindMap):**
```bash
cd frontend
npm install
npm run dev
# Frontend available at http://localhost:5173
```

**Next.js Examples:**
```bash
cd examples/nextjs
npm install
npm run dev
# Examples available at http://localhost:3000
```

**Benchmarks:**
```bash
# Terminal 1: Start examples
cd examples/nextjs
npm install
npm run dev

# Terminal 2: Run benchmarks
cd benchmarks/runner
npm install
npm start

# Terminal 3: View dashboard
cd benchmarks/dashboard
npm install
npm start
# Dashboard at http://localhost:3001
```

## API Endpoints

### Glossary API (`http://localhost:4000`)

- `GET /` - Health check
- `GET /api/terms` - List all glossary terms
- `GET /api/terms/:id` - Get specific term by ID
- `GET /api/search?q=query` - Search terms by keyword

### Dashboard API (`http://localhost:3001`)

- `GET /` - Dashboard UI
- `GET /api/results/latest` - Latest benchmark results
- `GET /api/results` - All benchmark results

## Key Metrics Explained

| Metric | Description | Good Threshold |
|--------|-------------|----------------|
| **Performance Score** | Overall Lighthouse score | ≥ 90 |
| **TTFB** | Time to First Byte | < 200ms |
| **FCP** | First Contentful Paint | < 1.8s |
| **LCP** | Largest Contentful Paint | < 2.5s |
| **CLS** | Cumulative Layout Shift | < 0.1 |
| **TBT** | Total Blocking Time | < 200ms |
| **SI** | Speed Index | < 3.4s |
| **TTI** | Time to Interactive | < 3.8s |

## Rendering Methods Comparison

| Aspect | SSR | SSG | CSR |
|--------|-----|-----|-----|
| **Rendering Location** | Server | Build time | Browser |
| **Data Freshness** | Always fresh | Static | Client-fetched |
| **SEO** | Excellent | Excellent | Limited |
| **TTFB** | Higher | Lowest | Low |
| **FCP** | Fast | Fastest | Slower |
| **Server Load** | High | None | Low |
| **Use Case** | Dynamic content | Static content | Interactive apps |

## Documentation

- **[Phase A Summary](docs/phase-a-summary.md)** - Glossary API implementation
- **[Glossary Terms](docs/glossary.json)** - All 26 curated terms
- **[Frontend README](frontend/README.md)** - MindMap implementation details
- **[Next.js Examples](examples/nextjs/README.md)** - Framework examples guide
- **[Framework Comparison](examples/README.md)** - Cross-framework patterns
- **[Benchmarks Guide](benchmarks/README.md)** - Performance testing methodology

## Project Highlights

### Technologies Used

**Backend:**
- Fastify (high-performance web framework)
- ES Modules
- Docker with health checks

**Frontend:**
- React 19 + Vite
- Cytoscape.js (graph visualization)
- Cytoscape-cola (layout algorithm)

**Examples:**
- Next.js 15 App Router
- TypeScript
- Tailwind CSS

**Benchmarking:**
- Lighthouse 12
- Puppeteer
- Chart.js (visualization)

### Security & Quality

- ✅ **Input validation** on all API endpoints
- ✅ **CORS configuration** for production
- ✅ **CodeQL scanning** (0 vulnerabilities)
- ✅ **Unit tests** for API endpoints
- ✅ **Health checks** for Docker containers

## Testing

```bash
# Backend tests
cd backend
npm test

# Build verification
cd frontend
npm run build

cd examples/nextjs
npm run build
```

## Docker Deployment

Full stack deployment:

```bash
docker-compose up -d

# Services:
# - glossary-api: Port 4000
# - frontend: Port 5173
```

Individual services:

```bash
# Backend
docker build -t glossary-api -f backend/Dockerfile .
docker run -p 4000:4000 glossary-api

# Frontend
docker build -t mindmap-frontend frontend/
docker run -p 80:80 mindmap-frontend

# Next.js Examples
docker build -t nextjs-examples examples/nextjs/
docker run -p 3000:3000 nextjs-examples
```

## Screenshots

### MindMap Visualization
![MindMap Frontend](https://github.com/user-attachments/assets/94fbf969-9779-4c4f-805b-b5a1ca6ce01c)

*Interactive graph showing relationships between SSR, SSG, CSR and related concepts*

## Contributing

This is an educational research project. Contributions, suggestions, and feedback are welcome!

### Areas for Future Work
- Mobile device benchmarking
- Additional framework implementations (Nuxt, SvelteKit, Astro)
- Real User Monitoring (RUM) integration
- CI/CD pipeline for automated benchmarking
- Performance budget tracking

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Cheikh Ebeoumar**
- GitHub: [@CheikhEbeoumar](https://github.com/CheikhEbeoumar)

## Acknowledgments

- MDN Web Docs for definitions and references
- Web.dev for performance best practices
- Lighthouse team for benchmarking tools
- Open source communities for framework documentation