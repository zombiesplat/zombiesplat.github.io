import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/config';

import react from '@astrojs/react';

import partytown from '@astrojs/partytown';

// Site URL from environment variable with localhost fallback
const siteUrl = process.env.SITE_URL || 'http://localhost:4321';

// Custom integration to warn about missing environment variables after build
function envCheckIntegration() {
  return {
    name: 'env-check',
    hooks: {
      'astro:build:done': () => {
        if (!process.env.SITE_URL) {
          console.warn('='.repeat(60));
          console.warn('WARNING: SITE_URL environment variable not set');
          console.warn('Build completed with fallback URL: http://localhost:4321');
          console.warn('For production, create .env file and set SITE_URL');
          console.warn('='.repeat(60) + '\n');
        }
      },
    },
  };
}

export default defineConfig({
  site: siteUrl,
  integrations: [mdx(), icon(), envCheckIntegration(), sitemap({
    filter: (page) => {
      const { features } = siteConfig;

      // Filter out pages based on feature flags
      if (!features.blog && page.includes('/blog')) return false;
      if (!features.docs && page.includes('/docs')) return false;
      if (!features.changelog && page.includes('/changelog')) return false;
      if (!features.testimonials && page.includes('/testimonials')) return false;
      if (!features.roadmap && page.includes('/roadmap')) return false;

      return true;
    },
  }), react(), partytown({
    debug: process.env.NODE_ENV === 'development',
  })],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/2017/09/30/certified-scrum-master.html": "/blog/i-am-a-certified-scrum-master",
    "/2018/01/29/time-to-take-off.html": "/blog/time-to-blast-off",
    "/2018/02/05/from-jquery-to-vuejs.html": "/blog/from-jquery-to-vuejs",
    "/2018/02/11/git-flow-and-scrum.html": "/blog/git-flow-and-scrum",
    "/2018/02/15/time-travel-validation-with-encryption.html": "/blog/time-travel-validation-with-encryption",
    "/2018/03/05/mutex-use-it.html": "/blog/mutex-use-it",
  }
});