import Fastify from 'fastify';
import cors from '@fastify/cors';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Enable CORS - restrict origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : true; // Allow all in development

await fastify.register(cors, {
  origin: allowedOrigins
});

// Load glossary data
let glossaryData = [];
try {
  const glossaryPath = join(__dirname, '../docs/glossary.json');
  const data = await readFile(glossaryPath, 'utf-8');
  glossaryData = JSON.parse(data);
  fastify.log.info(`Loaded ${glossaryData.length} terms from glossary`);
} catch (error) {
  fastify.log.error('Failed to load glossary data:', error);
}

// Health check endpoint
fastify.get('/', async (request, reply) => {
  return { 
    service: 'Glossary API',
    version: '1.0.0',
    status: 'running',
    terms: glossaryData.length
  };
});

// Get all terms
fastify.get('/api/terms', async (request, reply) => {
  return {
    terms: glossaryData,
    total: glossaryData.length
  };
});

// Get term by ID
fastify.get('/api/terms/:id', async (request, reply) => {
  const { id } = request.params;
  
  // Validate ID format (alphanumeric, hyphens, underscores only)
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    reply.code(400);
    return { error: 'Invalid term ID format', id };
  }
  
  const term = glossaryData.find(t => t.id === id);
  
  if (!term) {
    reply.code(404);
    return { error: 'Term not found', id };
  }
  
  return term;
});

// Search terms
fastify.get('/api/search', async (request, reply) => {
  const { q } = request.query;
  
  if (!q) {
    reply.code(400);
    return { error: 'Query parameter "q" is required' };
  }
  
  // Validate query length
  if (q.length > 100) {
    reply.code(400);
    return { error: 'Query too long (max 100 characters)' };
  }
  
  const query = q.toLowerCase();
  const results = glossaryData.filter(term => 
    term.term.toLowerCase().includes(query) ||
    term.short_definition.toLowerCase().includes(query) ||
    term.long_definition.toLowerCase().includes(query) ||
    term.tags.some(tag => tag.toLowerCase().includes(query))
  );
  
  return {
    query: q,
    results,
    count: results.length
  };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
