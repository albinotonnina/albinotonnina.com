import { useState, useEffect } from 'react';

// --- CONFIGURATION REQUIRED ---

// ASINs for your book editions (based on the screenshot):
export const ASINS = {
  KINDLE: 'B0G3D55C64',
  PAPERBACK: '191937101X',
  HARDCOVER: '1919371001',
};
const DEFAULT_ASIN = ASINS.KINDLE;

// 2. Map the Amazon country code (locale) to your unique Associates Tracking ID.
// The IDs below have been extracted from your Amazon Associates "Link Stores" screenshot.
const AFFILIATE_CONFIG = {
  // United States (.com) - Default Fallback
  US: { domain: 'com', trackingId: 'albinotonnina-20', label: 'Amazon US' },
  // United Kingdom (.co.uk) - Primary ID
  GB: { domain: 'co.uk', trackingId: 'albinotonnina-21', label: 'Amazon UK' },
  // Canada
  CA: { domain: 'ca', trackingId: 'albinotonni06-20', label: 'Amazon Canada' },
  // Germany
  DE: { domain: 'de', trackingId: 'albinotonniof-21', label: 'Amazon Germany' },
  // France
  FR: { domain: 'fr', trackingId: 'albinotonni05-21', label: 'Amazon France' },
  // Italy
  IT: { domain: 'it', trackingId: 'albinotonnioa-21', label: 'Amazon Italia' },
  // Spain
  ES: { domain: 'es', trackingId: 'albinotonni03-21', label: 'Amazon Spain' },
  // Australia
  AU: { domain: 'com.au', trackingId: 'albinotonnina-22', label: 'Amazon Australia' },
};

// Default fallback configuration for unsupported or unknown locations
const DEFAULT_CONFIG = AFFILIATE_CONFIG['GB'];

/**
 * Detect country code from browser language settings
 * Examples: "en-GB" -> "GB", "de-DE" -> "DE", "fr-FR" -> "FR"
 */
const detectCountryFromBrowserLanguage = () => {
  try {
    const browserLanguage = navigator.language || navigator.userLanguage;
    const countryCode = browserLanguage.split('-')[1]?.toUpperCase();

    if (countryCode && AFFILIATE_CONFIG[countryCode]) {
      console.log('[useAmazonLink] Detected country from browser language:', countryCode);
      return countryCode;
    }
  } catch (err) {
    console.warn('[useAmazonLink] Browser language detection failed:', err.message);
  }

  return null;
};

/**
 * Custom React Hook to generate a geo-localized Amazon affiliate link.
 * Uses browser language detection for fast, reliable country detection.
 *
 * @param {string} asin - The Amazon Standard Identification Number (e.g., ASINS.KINDLE).
 * @param {string} forceCountry - Optional: Force a specific country code for testing (e.g., 'GB', 'US', 'CA')
 * @returns {{url: string, countryName: string, loading: boolean, error: string | null, detectedCountry: string}}
 */
export default function useAmazonLink(asin = DEFAULT_ASIN, forceCountry = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState({
    url: '#',
    countryName: DEFAULT_CONFIG.label,
    detectedCountry: 'US',
  });

  useEffect(() => {
    if (!asin) {
      setError('ASIN is required.');
      return;
    }

    let countryCode = 'US'; // Start with US fallback
    let fetchError = null;

    // If forceCountry is provided, use it directly (useful for testing)
    if (forceCountry) {
      countryCode = forceCountry;
      console.log('[useAmazonLink] Using forced country code:', forceCountry);
    } else {
      // Detect from browser language
      const detected = detectCountryFromBrowserLanguage();
      if (detected) {
        countryCode = detected;
      }
    }

    // Determine the final link configuration
    const linkConfig = AFFILIATE_CONFIG[countryCode]
      ? AFFILIATE_CONFIG[countryCode]
      : DEFAULT_CONFIG;

    // Construct the full, affiliated URL
    const finalUrl = `https://www.amazon.${linkConfig.domain}/dp/${asin}?tag=${linkConfig.trackingId}`;

    console.log('[useAmazonLink] Generated link:', {
      countryCode,
      domain: linkConfig.domain,
      trackingId: linkConfig.trackingId,
    });

    setLinkData({
      url: finalUrl,
      countryName: linkConfig.label,
      detectedCountry: countryCode,
    });
    setError(fetchError);
    setLoading(false);
  }, [asin, forceCountry]); // Re-run effect if ASIN or forceCountry changes

  return {
    url: linkData.url,
    countryName: linkData.countryName,
    loading,
    error,
    detectedCountry: linkData.detectedCountry,
  };
}
