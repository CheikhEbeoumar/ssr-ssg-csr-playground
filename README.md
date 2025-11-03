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
├── backend/          # Glossary API service
├── frontend/         # MindMap visualization interface
├── benchmarks/       # Performance measurement tools and results
├── docs/            # Documentation and glossary data
├── infra/           # Infrastructure configuration (Docker, etc.)
└── examples/        # Example implementations across frameworks
```

## Features

### Phase A: Glossary API
- Curated glossary of rendering-related terms
- RESTful API for term lookup and search
- Dockerized service

### Phase B: Interactive MindMap & Examples
- Interactive semantic graph of concepts
- Example pages implemented across multiple frameworks (Next.js, Nuxt.js, SvelteKit, Astro)
- Demonstrations of SSR, SSG, and CSR patterns

### Phase C: Benchmarking
- Automated performance measurements
- Metrics: TTFB, FCP, LCP, CLS, hydration times
- Visual dashboard for comparing results

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/CheikhEbeoumar/ssr-ssg-csr-playground.git
cd ssr-ssg-csr-playground

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

#### Glossary API Service
```bash
cd backend
npm start
# API available at http://localhost:4000
```

#### Frontend
```bash
cd frontend
npm run dev
# Frontend available at http://localhost:5173
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## API Endpoints

- `GET /api/terms` - List all glossary terms
- `GET /api/terms/:id` - Get specific term by ID
- `GET /api/search?q=query` - Search terms

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

This is an educational project. Contributions, suggestions, and feedback are welcome!