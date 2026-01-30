/**
 * Site Configuration
 *
 * @description
 * Core site metadata and branding settings.
 * These values can be customized via environment variables or by editing the defaults below.
 */

import type { SocialLinks, LegalConfig } from '../lib/types';

/** Site name displayed in header, footer, and meta tags */
export const name = import.meta.env.SITE_NAME || 'Asterisk Pound';

/** Site description for SEO and meta tags */
export const description =
  import.meta.env.SITE_DESCRIPTION || 'A devlog for game development and showcase of projects';

/** Production URL of your site (used for sitemap, RSS, canonical URLs) */
export const url = import.meta.env.SITE_URL || 'http://localhost:4321';

/** Author name for meta tags and copyright */
export const author = import.meta.env.SITE_AUTHOR || 'Asterisk Pound';

/** Path to logo file (relative to /public) */
export const logo = '/logo.svg';

/** Path to Open Graph image (relative to /public) */
export const ogImage = '/images/og-image.png';

/** Social media links */
export const social: SocialLinks = {
  twitter: 'https://x.com/asterisk_pound',
  github: 'https://github.com/asteriskpound',
  discord: 'https://discord.gg/asteriskpound',
  youtube: 'https://youtube.com/@asteriskpound',
};

/** Legal configuration for privacy policy and terms pages */
export const legal: LegalConfig = {
  privacyEmail: 'privacy@asteriskpound.com',
  legalEmail: 'legal@asteriskpound.com',
  lastUpdated: 'January 27, 2026',
};
