import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Enable CORS
await fastify.register(cors);

// Serve static files
await fastify.register(fastifyStatic, {
  root: join(__dirname, 'public'),
  prefix: '/'
});

// API: Get latest benchmark results
fastify.get('/api/results/latest', async (request, reply) => {
  try {
    const filePath = join(__dirname, '../results/latest.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    reply.code(404);
    return { error: 'No results found', message: error.message };
  }
});

// API: Get all benchmark results
fastify.get('/api/results', async (request, reply) => {
  try {
    const resultsDir = join(__dirname, '../results');
    const files = await readdir(resultsDir);
    
    const benchmarkFiles = files.filter(f => f.startsWith('benchmark-') && f.endsWith('.json'));
    
    const results = await Promise.all(
      benchmarkFiles.map(async (file) => {
        const data = await readFile(join(resultsDir, file), 'utf-8');
        return {
          filename: file,
          data: JSON.parse(data)
        };
      })
    );
    
    return results;
  } catch (error) {
    reply.code(500);
    return { error: 'Failed to read results', message: error.message };
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Dashboard running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
