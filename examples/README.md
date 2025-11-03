# Framework Examples

This directory contains example implementations demonstrating SSR, SSG, and CSR rendering patterns across popular frameworks.

## Structure

```
examples/
├── nextjs/        # Next.js (React) - IMPLEMENTED
├── nuxtjs/        # Nuxt.js (Vue) - DOCUMENTED
├── sveltekit/     # SvelteKit (Svelte) - DOCUMENTED
└── astro/         # Astro - DOCUMENTED
```

## Next.js (React) - ✅ Implemented

**Status**: Fully implemented with working examples

### Features
- Three separate pages demonstrating SSR, SSG, and CSR
- TypeScript + Tailwind CSS
- Docker support
- API integration with glossary backend

### Pages
- `/` - Home with links to examples
- `/ssr` - Server-Side Rendering
- `/ssg` - Static Site Generation
- `/csr` - Client-Side Rendering

See [nextjs/README.md](./nextjs/README.md) for details.

## Nuxt.js (Vue) - 📝 Documented

**Status**: Documentation and implementation guide provided

Nuxt.js is a Vue.js framework with similar patterns to Next.js.

### Rendering Strategies

#### SSR (Server-Side Rendering)
```vue
<script setup>
// pages/ssr.vue
const { data } = await useFetch('/api/terms', {
  server: true,  // Fetch on server
  lazy: false    // Wait for data before rendering
})
</script>
```

#### SSG (Static Site Generation)
```vue
<script setup>
// pages/ssg.vue
const { data } = await useFetch('/api/terms', {
  server: true,
  lazy: false
})
</script>

// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/ssg']
    }
  }
})
```

#### CSR (Client-Side Rendering)
```vue
<script setup>
// pages/csr.vue
const { data } = await useFetch('/api/terms', {
  server: false,  // Client-side only
  lazy: true
})
</script>
```

### Key Differences from Next.js
- Uses Vue.js instead of React
- Built-in composables like `useFetch` and `useAsyncData`
- File-based routing in `pages/` directory
- Nitro server engine for universal rendering

### Setup Command
```bash
npx nuxi@latest init nuxtjs
cd nuxtjs
npm install
```

## SvelteKit (Svelte) - 📝 Documented

**Status**: Documentation and implementation guide provided

SvelteKit is a Svelte framework with server-side capabilities.

### Rendering Strategies

#### SSR (Server-Side Rendering)
```svelte
<!-- routes/ssr/+page.svelte -->
<script>
  export let data;
</script>

<!-- routes/ssr/+page.ts -->
export async function load({ fetch }) {
  const res = await fetch('/api/terms');
  return {
    terms: await res.json()
  };
}
```

#### SSG (Static Site Generation)
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    prerender: {
      entries: ['/', '/ssg']
    }
  }
};
```

#### CSR (Client-Side Rendering)
```svelte
<!-- routes/csr/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  let terms = [];
  
  onMount(async () => {
    const res = await fetch('/api/terms');
    terms = await res.json();
  });
</script>

<!-- routes/csr/+page.ts -->
export const ssr = false; // Disable SSR for this page
```

### Key Differences from Next.js
- Uses Svelte instead of React (compiled, no virtual DOM)
- Load functions in `+page.ts` for data fetching
- Adapters for different deployment targets
- Built-in form actions and progressive enhancement

### Setup Command
```bash
npm create svelte@latest sveltekit
cd sveltekit
npm install
```

## Astro - 📝 Documented

**Status**: Documentation and implementation guide provided

Astro is a modern static site builder with partial hydration.

### Rendering Strategies

#### SSG (Static Site Generation - Default)
```astro
---
// pages/ssg.astro
const response = await fetch('http://localhost:4000/api/terms');
const data = await response.json();
---

<html>
  <body>
    <h1>Static Site Generation</h1>
    {data.terms.map(term => (
      <div>{term.term}</div>
    ))}
  </body>
</html>
```

#### SSR (Server-Side Rendering)
```astro
---
// pages/ssr.astro
const response = await fetch('http://localhost:4000/api/terms');
const data = await response.json();
---

<!-- astro.config.mjs -->
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' })
});
```

#### CSR (Client-Side Rendering)
```astro
---
// pages/csr.astro
---

<html>
  <body>
    <h1>Client-Side Rendering</h1>
    <div id="terms"></div>
    
    <script>
      async function fetchTerms() {
        const res = await fetch('/api/terms');
        const data = await res.json();
        document.getElementById('terms').innerHTML = 
          data.terms.map(t => `<div>${t.term}</div>`).join('');
      }
      fetchTerms();
    </script>
  </body>
</html>
```

### Key Differences from Next.js
- Zero JavaScript by default (ships only what you need)
- Component-agnostic (use React, Vue, Svelte together)
- Island architecture for partial hydration
- Optimized for content-focused sites

### Setup Command
```bash
npm create astro@latest astro
cd astro
npm install
```

## Comparison Matrix

| Feature | Next.js | Nuxt.js | SvelteKit | Astro |
|---------|---------|---------|-----------|-------|
| **Framework** | React | Vue | Svelte | Agnostic |
| **SSR** | ✅ Native | ✅ Native | ✅ Native | ✅ With adapter |
| **SSG** | ✅ Native | ✅ Native | ✅ Native | ✅ Default |
| **CSR** | ✅ 'use client' | ✅ server: false | ✅ ssr: false | ✅ Script tags |
| **Hybrid** | ✅ ISR/PPR | ✅ Hybrid mode | ✅ Mixed | ✅ Mixed |
| **TypeScript** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in |
| **DX** | Excellent | Excellent | Excellent | Excellent |

## Implementation Priority

For this thesis project, we have:

1. ✅ **Next.js**: Fully implemented (most popular React framework)
2. 📝 **Nuxt.js**: Documented approach (Vue ecosystem)
3. 📝 **SvelteKit**: Documented approach (Svelte ecosystem)
4. 📝 **Astro**: Documented approach (Content-focused sites)

The Next.js implementation serves as the reference implementation demonstrating all three rendering patterns. The documentation for other frameworks provides clear guidance for implementation if needed in future work.

## Running Examples

### Next.js
```bash
cd nextjs
npm install
npm run dev
# Visit http://localhost:3000
```

### Future Implementations
Each framework would follow a similar pattern:
1. Install framework CLI tool
2. Create three routes/pages (SSR, SSG, CSR)
3. Fetch data from glossary API
4. Add Docker support
5. Document differences

## Docker Integration

Future docker-compose.yml could include:

```yaml
services:
  nextjs-example:
    build: ./examples/nextjs
    ports:
      - "3000:3000"
    depends_on:
      - glossary-api
      
  nuxtjs-example:
    build: ./examples/nuxtjs
    ports:
      - "3001:3000"
    depends_on:
      - glossary-api
```

## Notes

The complete implementation of all frameworks would be similar in complexity to the Next.js example. For the scope of this thesis:

- **Next.js** provides a full working reference
- **Documentation** covers the patterns for other frameworks
- **Implementation** can be extended in future iterations

This approach demonstrates understanding of rendering patterns across the JavaScript ecosystem while maintaining focus on the core research objectives.
