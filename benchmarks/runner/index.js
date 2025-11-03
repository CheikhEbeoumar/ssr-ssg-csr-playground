import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const TARGETS = [
  {
    name: 'Next.js SSR',
    url: 'http://localhost:3000/ssr',
    framework: 'nextjs',
    renderMethod: 'ssr'
  },
  {
    name: 'Next.js SSG',
    url: 'http://localhost:3000/ssg',
    framework: 'nextjs',
    renderMethod: 'ssg'
  },
  {
    name: 'Next.js CSR',
    url: 'http://localhost:3000/csr',
    framework: 'nextjs',
    renderMethod: 'csr'
  }
];

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

/**
 * Run Lighthouse audit on a URL
 */
async function runLighthouse(url, browser) {
  const { port } = new URL(browser.wsEndpoint());
  
  console.log(`Running Lighthouse on ${url}...`);
  
  const result = await lighthouse(url, {
    port,
    output: 'json',
    logLevel: 'error',
  }, LIGHTHOUSE_CONFIG);

  return result;
}

/**
 * Extract key metrics from Lighthouse result
 */
function extractMetrics(lhr) {
  const metrics = {
    performance: lhr.categories.performance.score * 100,
    ttfb: lhr.audits['server-response-time']?.numericValue || 0,
    fcp: lhr.audits['first-contentful-paint']?.numericValue || 0,
    lcp: lhr.audits['largest-contentful-paint']?.numericValue || 0,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
    tbt: lhr.audits['total-blocking-time']?.numericValue || 0,
    si: lhr.audits['speed-index']?.numericValue || 0,
    tti: lhr.audits['interactive']?.numericValue || 0,
  };

  return metrics;
}

/**
 * Run benchmarks on all targets
 */
async function runBenchmarks() {
  console.log('Starting benchmark runner...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = [];

  try {
    for (const target of TARGETS) {
      console.log(`\n📊 Benchmarking: ${target.name}`);
      console.log(`URL: ${target.url}`);
      
      try {
        // Run Lighthouse audit
        const { lhr } = await runLighthouse(target.url, browser);
        
        // Extract metrics
        const metrics = extractMetrics(lhr);
        
        // Compile result
        const result = {
          ...target,
          timestamp: new Date().toISOString(),
          metrics,
        };

        results.push(result);
        
        console.log(`✅ Completed: Performance Score = ${metrics.performance.toFixed(1)}`);
        console.log(`   TTFB: ${metrics.ttfb.toFixed(0)}ms`);
        console.log(`   FCP: ${metrics.fcp.toFixed(0)}ms`);
        console.log(`   LCP: ${metrics.lcp.toFixed(0)}ms`);
        console.log(`   CLS: ${metrics.cls.toFixed(3)}`);
        
      } catch (error) {
        console.error(`❌ Failed to benchmark ${target.name}:`, error.message);
        results.push({
          ...target,
          timestamp: new Date().toISOString(),
          error: error.message,
        });
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

/**
 * Save results to JSON file
 */
async function saveResults(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = join(__dirname, '../results');
  const outputFile = join(outputDir, `benchmark-${timestamp}.json`);
  
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });
  
  // Save results
  await writeFile(outputFile, JSON.stringify(results, null, 2));
  
  console.log(`\n💾 Results saved to: ${outputFile}`);
  
  // Also save as latest
  const latestFile = join(outputDir, 'latest.json');
  await writeFile(latestFile, JSON.stringify(results, null, 2));
  
  console.log(`💾 Latest results saved to: ${latestFile}`);
}

/**
 * Generate summary report
 */
function printSummary(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📈 BENCHMARK SUMMARY');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => !r.error);
  
  if (successful.length === 0) {
    console.log('\n❌ No successful benchmarks to summarize.');
    return;
  }
  
  console.log('\nPerformance Scores:');
  successful.forEach(r => {
    console.log(`  ${r.name.padEnd(20)}: ${r.metrics.performance.toFixed(1)}/100`);
  });
  
  console.log('\nCore Web Vitals:');
  console.log('  Metric      SSR        SSG        CSR');
  console.log('  ----------------------------------------');
  
  const ssr = successful.find(r => r.renderMethod === 'ssr');
  const ssg = successful.find(r => r.renderMethod === 'ssg');
  const csr = successful.find(r => r.renderMethod === 'csr');
  
  if (ssr && ssg && csr) {
    console.log(`  TTFB        ${ssr.metrics.ttfb.toFixed(0).padEnd(10)} ${ssg.metrics.ttfb.toFixed(0).padEnd(10)} ${csr.metrics.ttfb.toFixed(0)}ms`);
    console.log(`  FCP         ${ssr.metrics.fcp.toFixed(0).padEnd(10)} ${ssg.metrics.fcp.toFixed(0).padEnd(10)} ${csr.metrics.fcp.toFixed(0)}ms`);
    console.log(`  LCP         ${ssr.metrics.lcp.toFixed(0).padEnd(10)} ${ssg.metrics.lcp.toFixed(0).padEnd(10)} ${csr.metrics.lcp.toFixed(0)}ms`);
    console.log(`  CLS         ${ssr.metrics.cls.toFixed(3).padEnd(10)} ${ssg.metrics.cls.toFixed(3).padEnd(10)} ${csr.metrics.cls.toFixed(3)}`);
  }
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  try {
    const results = await runBenchmarks();
    await saveResults(results);
    printSummary(results);
    
    console.log('\n✅ Benchmark run completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Benchmark run failed:', error);
    process.exit(1);
  }
}

main();
