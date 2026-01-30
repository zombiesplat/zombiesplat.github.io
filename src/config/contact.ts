/**
 * Contact Page Configuration
 *
 * @description
 * Contact information, methods, and FAQ data for the contact page.
 * Modify these values to customize your contact page content.
 */

import type { ContactInfo, ContactMethod, ContactFAQ } from '../lib/types';

/** Contact information used across contact page and legal pages */
export const contact: ContactInfo = {
  email: 'hello@asteriskpound.com',
  supportEmail: 'support@asteriskpound.com',
  salesEmail: 'hello@asteriskpound.com',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  },
};

/** Contact methods displayed on the contact page */
export const contactMethods: ContactMethod[] = [
  {
    icon: 'lucide:mail',
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: 'simple-icons:discord',
    label: 'Discord',
    value: 'Join Discord',
    href: 'https://discord.gg/asteriskpound',
  },
  {
    icon: 'lucide:twitter',
    label: 'Twitter',
    value: '@asteriskpound',
    href: 'https://twitter.com/asteriskpound',
  },
];

/** FAQ items displayed on the contact page */
export const contactFAQs: ContactFAQ[] = [
  {
    question: "What's your typical response time?",
    answer: 'We respond to most inquiries within 24 hours during business days.',
  },
  {
    question: 'Do you offer phone support?',
    answer:
      'Phone support is available for Enterprise customers. Others can reach us via email or Discord.',
  },
  {
    question: 'How do I report a bug?',
    answer: 'Use the form with "Technical support" as subject, or open an issue on our GitHub.',
  },
];
