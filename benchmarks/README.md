# Benchmarks

Performance benchmarking infrastructure for comparing SSR, SSG, and CSR rendering methods.

## Structure

```
benchmarks/
├── runner/           # Lighthouse-based benchmark runner
│   ├── index.js
│   └── package.json
├── dashboard/        # Web dashboard for visualizing results
│   ├── server.js
│   ├── package.json
│   └── public/
│       └── index.html
└── results/          # Benchmark results (JSON files)
    └── latest.json
```

## Components

### 1. Benchmark Runner

Automated performance testing using Google Lighthouse.

**Features:**
- Lighthouse audits for each rendering method
- Core Web Vitals collection (TTFB, FCP, LCP, CLS)
- Additional metrics (TBT, SI, TTI)
- JSON output for analysis
- Configurable targets

**Metrics Collected:**
- **Performance Score**: Overall Lighthouse performance score (0-100)
- **TTFB** (Time to First Byte): Server response time
- **FCP** (First Contentful Paint): Time to first visible content
- **LCP** (Largest Contentful Paint): Time to largest content element
- **CLS** (Cumulative Layout Shift): Visual stability score
- **TBT** (Total Blocking Time): Main thread blocking time
- **SI** (Speed Index): How quickly content is visually displayed
- **TTI** (Time to Interactive): Time until page is fully interactive

### 2. Metrics Dashboard

Web-based dashboard for visualizing benchmark results.

**Features:**
- Real-time results display
- Comparison tables
- Interactive charts (Bar and Radar)
- Auto-refresh capability
- Historical results tracking

## Usage

### Running Benchmarks

```bash
# Install dependencies
cd benchmarks/runner
npm install

# Ensure target applications are running
# (e.g., Next.js examples on port 3000)

# Run benchmarks
npm start
```

**Output:**
- Results saved to `benchmarks/results/benchmark-[timestamp].json`
- Latest results saved to `benchmarks/results/latest.json`
- Console summary with key metrics

### Viewing Dashboard

```bash
# Install dependencies
cd benchmarks/dashboard
npm install

# Start dashboard server
npm start
# Open http://localhost:3001
```

## Benchmark Configuration

Edit `benchmarks/runner/index.js` to configure targets:

```javascript
const TARGETS = [
  {
    name: 'Next.js SSR',
    url: 'http://localhost:3000/ssr',
    framework: 'nextjs',
    renderMethod: 'ssr'
  },
  // Add more targets...
];
```

### Lighthouse Settings

Current configuration:
- **Form Factor**: Desktop
- **Throttling**: Fast 3G simulation
- **Screen**: 1920x1080
- **Categories**: Performance only

Modify `LIGHTHOUSE_CONFIG` in `index.js` to adjust settings.

## Benchmark Methodology

### Test Environment

- **Network**: Simulated fast 3G (10 Mbps)
- **CPU**: No throttling (baseline performance)
- **Cache**: Cleared between runs
- **Browser**: Headless Chromium via Puppeteer

### Rendering Methods Tested

#### Server-Side Rendering (SSR)
- Fresh data on each request
- Server processes request → fetches data → renders HTML
- Sent complete HTML to client
- Good for dynamic content

#### Static Site Generation (SSG)
- Pre-rendered at build time
- HTML generated once, served from cache/CDN
- Fastest delivery
- Best for static content

#### Client-Side Rendering (CSR)
- Minimal initial HTML
- JavaScript fetches data and renders in browser
- Interactive but slower initial load
- Good for highly dynamic UIs

### Metrics Interpretation

**Good Performance Thresholds:**
- Performance Score: ≥ 90
- TTFB: < 200ms
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1

**Typical Results:**

| Metric | SSR | SSG | CSR |
|--------|-----|-----|-----|
| TTFB | Higher | Lowest | Low |
| FCP | Fast | Fastest | Slower |
| LCP | Fast | Fastest | Slower |
| CLS | Good | Good | Varies |

## Docker Integration

Future docker-compose.yml integration:

```yaml
services:
  benchmark-runner:
    build: ./benchmarks/runner
    volumes:
      - ./benchmarks/results:/app/results
    depends_on:
      - nextjs-example
    environment:
      - TARGETS=http://nextjs-example:3000
      
  metrics-dashboard:
    build: ./benchmarks/dashboard
    ports:
      - "3001:3001"
    volumes:
      - ./benchmarks/results:/app/results:ro
```

## Results Analysis

### Reading JSON Results

```json
{
  "name": "Next.js SSR",
  "url": "http://localhost:3000/ssr",
  "framework": "nextjs",
  "renderMethod": "ssr",
  "timestamp": "2025-11-03T23:00:00.000Z",
  "metrics": {
    "performance": 95.5,
    "ttfb": 120.5,
    "fcp": 850.2,
    "lcp": 1200.8,
    "cls": 0.002,
    "tbt": 15.0,
    "si": 900.5,
    "tti": 1500.2
  }
}
```

### Comparative Analysis

The dashboard automatically:
1. Loads latest results
2. Calculates averages
3. Identifies best performers
4. Visualizes comparisons
5. Highlights performance scores

### Historical Tracking

All benchmark runs are saved with timestamps, enabling:
- Performance trend analysis
- Regression detection
- Optimization validation
- Framework comparison over time

## Extending the Benchmarks

### Adding New Targets

1. Add entry to `TARGETS` array in `runner/index.js`
2. Ensure target URL is accessible
3. Run benchmarks

### Custom Metrics

Lighthouse provides additional audits. To include:

1. Modify `extractMetrics()` function
2. Add new metrics from `lhr.audits`
3. Update dashboard to display new metrics

### Multiple Frameworks

To benchmark Nuxt.js, SvelteKit, etc.:

```javascript
const TARGETS = [
  // Next.js
  { name: 'Next.js SSR', url: 'http://localhost:3000/ssr', ... },
  { name: 'Next.js SSG', url: 'http://localhost:3000/ssg', ... },
  { name: 'Next.js CSR', url: 'http://localhost:3000/csr', ... },
  
  // Nuxt.js
  { name: 'Nuxt SSR', url: 'http://localhost:3001/ssr', ... },
  { name: 'Nuxt SSG', url: 'http://localhost:3001/ssg', ... },
  { name: 'Nuxt CSR', url: 'http://localhost:3001/csr', ... },
];
```

## Limitations

- Requires targets to be running and accessible
- Lighthouse results can vary between runs (±5% is normal)
- Simulated throttling may not match real-world conditions
- Single-page benchmarks (not full user journeys)
- Desktop-only configuration (mobile can be added)

## Best Practices

1. **Run Multiple Times**: Average results from 3-5 runs
2. **Stable Environment**: Minimize background processes
3. **Warm Up**: Run once before official benchmarks
4. **Consistent Conditions**: Same hardware, network, time of day
5. **Document Changes**: Note any config or code changes

## Future Enhancements

- [ ] Automated scheduled benchmarks
- [ ] CI/CD integration
- [ ] Mobile device testing
- [ ] Custom throttling profiles
- [ ] Real User Monitoring (RUM) integration
- [ ] Performance budgets and alerts
- [ ] Export to CSV/PDF
- [ ] Historical trend charts

## References

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [Puppeteer](https://pptr.dev/)
- [Core Web Vitals Thresholds](https://web.dev/defining-core-web-vitals-thresholds/)
