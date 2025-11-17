import { useMemo } from 'react';

// Map of country codes to Amazon domain and search query
const AMAZON_REGIONS = {
  // North America
  US: { domain: 'amazon.com', country: 'United States' },
  CA: { domain: 'amazon.ca', country: 'Canada' },
  MX: { domain: 'amazon.com.mx', country: 'Mexico' },

  // Europe
  GB: { domain: 'amazon.co.uk', country: 'United Kingdom' },
  DE: { domain: 'amazon.de', country: 'Germany' },
  FR: { domain: 'amazon.fr', country: 'France' },
  IT: { domain: 'amazon.it', country: 'Italy' },
  ES: { domain: 'amazon.es', country: 'Spain' },
  NL: { domain: 'amazon.nl', country: 'Netherlands' },
  SE: { domain: 'amazon.se', country: 'Sweden' },
  PL: { domain: 'amazon.pl', country: 'Poland' },

  // Asia Pacific
  JP: { domain: 'amazon.co.jp', country: 'Japan' },
  AU: { domain: 'amazon.com.au', country: 'Australia' },
  IN: { domain: 'amazon.in', country: 'India' },
  SG: { domain: 'amazon.sg', country: 'Singapore' },

  // Brazil
  BR: { domain: 'amazon.com.br', country: 'Brazil' },
};

/**
 * Detects user's likely region based on browser locale and timezone
 * Returns country code (ISO 3166-1 alpha-2)
 */
export const detectUserCountry = () => {
  // Get locale from browser
  const locale = navigator.language || navigator.userLanguage;

  // Extract country code if present (e.g., "en-US" -> "US")
  if (locale && locale.includes('-')) {
    const [, country] = locale.split('-');
    const countryCode = country.toUpperCase();
    if (AMAZON_REGIONS[countryCode]) {
      return countryCode;
    }
  }

  // Try to detect from language alone
  const languageMap = {
    en: 'US', // Default English to US
    de: 'DE',
    fr: 'FR',
    it: 'IT',
    es: 'ES',
    ja: 'JP',
    pt: 'BR',
    nl: 'NL',
    sv: 'SE',
    pl: 'PL',
  };

  const language = locale.split('-')[0].toLowerCase();
  if (languageMap[language]) {
    return languageMap[language];
  }

  // Fallback to US
  return 'US';
};

/**
 * Hook to get the appropriate Amazon link for the user's region
 * @param {string} searchQuery - The search query (e.g., "developer playbook ai era")
 * @returns {object} - { url, countryCode, countryName }
 */
export const useAmazonLink = (searchQuery = 'developer playbook ai era') => {
  return useMemo(() => {
    const countryCode = detectUserCountry();
    const region = AMAZON_REGIONS[countryCode] || AMAZON_REGIONS.US;

    // Construct Amazon search URL
    const url = `https://${region.domain}/s?k=${encodeURIComponent(searchQuery)}`;

    return {
      url,
      countryCode,
      countryName: region.country,
      domain: region.domain,
    };
  }, [searchQuery]);
};

export default useAmazonLink;
