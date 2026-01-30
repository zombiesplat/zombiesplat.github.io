/**
 * Navigation Configuration
 *
 * @description
 * Centralized navigation configuration for header and footer.
 * All navigation items are defined here for consistency and easy maintenance.
 *
 * Items with a `feature` property will only be shown if that feature is enabled
 * in the site config's feature flags.
 */

import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  /**
   * Header Navigation
   * - main: Primary navigation links
   * - cta: Call-to-action buttons on the right
   */
  header: {
    main: [
      { label: 'Blog', href: '/blog', feature: 'blog' },
      { label: 'Projects', href: '/projects' },
      { label: 'About', href: '/about' },
      { label: 'Resume', href: '/resume' },
    ],
    cta: [
      { label: 'Contact', href: '/contact', variant: 'primary' },
    ],
  },

  /**
   * Footer Navigation
   * Organized into 5 columns: Product, Solutions, Resources, Company, Legal
   */
  footer: {
    product: [
    ],
    solutions: [
   ],
    resources: [
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
      { label: 'Resume', href: '/resume' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      // { label: 'Privacy', href: '/privacy' },
      // { label: 'Terms', href: '/terms' },
    ],
  },
};
