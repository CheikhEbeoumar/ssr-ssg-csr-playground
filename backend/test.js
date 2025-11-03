import { test } from 'node:test';
import assert from 'node:assert';

test('Glossary API health check', async (t) => {
  const response = await fetch('http://localhost:4000/');
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.service, 'Glossary API');
  assert.ok(data.terms > 0);
});

test('Get all terms', async (t) => {
  const response = await fetch('http://localhost:4000/api/terms');
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(data.terms));
  assert.ok(data.terms.length > 0);
  assert.strictEqual(data.total, data.terms.length);
});

test('Get term by ID', async (t) => {
  const response = await fetch('http://localhost:4000/api/terms/ssr');
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.id, 'ssr');
  assert.ok(data.term);
  assert.ok(data.short_definition);
});

test('Get non-existent term returns 404', async (t) => {
  const response = await fetch('http://localhost:4000/api/terms/nonexistent');
  const data = await response.json();
  
  assert.strictEqual(response.status, 404);
  assert.ok(data.error);
});

test('Search terms', async (t) => {
  const response = await fetch('http://localhost:4000/api/search?q=rendering');
  const data = await response.json();
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.query, 'rendering');
  assert.ok(Array.isArray(data.results));
  assert.ok(data.results.length > 0);
  assert.strictEqual(data.count, data.results.length);
});

test('Search without query returns 400', async (t) => {
  const response = await fetch('http://localhost:4000/api/search');
  const data = await response.json();
  
  assert.strictEqual(response.status, 400);
  assert.ok(data.error);
});
