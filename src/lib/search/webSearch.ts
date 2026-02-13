/**
 * Web Search Utility for Medical Information Verification
 * Searches reliable medical sources to verify information
 */

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  timestamp: string;
}

// Trusted medical sources
const TRUSTED_SOURCES = [
  'nih.gov',
  'cdc.gov',
  'mayoclinic.org',
  'who.int',
  'kidney.org',
  'niddk.nih.gov',
  'uptodate.com',
  'pubmed.ncbi.nlm.nih.gov',
  'medlineplus.gov',
  'clevelandclinic.org',
  'hopkinsmedicine.org',
  'webmd.com',
];

/**
 * Search web for medical information using DuckDuckGo API
 */
export async function searchMedicalInfo(query: string): Promise<SearchResponse> {
  try {
    // Add medical context to search query
    const medicalQuery = `${query} site:nih.gov OR site:kidney.org OR site:mayoclinic.org dialysis nephrology`;
    
    // Use DuckDuckGo Instant Answer API (no API key needed)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(medicalQuery)}&format=json&no_html=1&skip_disambig=1`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'RADAR-Medical-Assistant/1.0',
      },
    });

    if (!response.ok) {
      console.error('Search API error:', response.statusText);
      return { results: [], query, timestamp: new Date().toISOString() };
    }

    const data = await response.json();
    
    // Parse results
    const results: SearchResult[] = [];
    
    // Add abstract if available
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'Medical Information',
        url: data.AbstractURL || '',
        snippet: data.Abstract,
        source: data.AbstractSource || 'Medical Database',
      });
    }

    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.substring(0, 100),
            url: topic.FirstURL,
            snippet: topic.Text,
            source: extractDomain(topic.FirstURL),
          });
        }
      });
    }

    return {
      results,
      query: medicalQuery,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Search error:', error);
    return { results: [], query, timestamp: new Date().toISOString() };
  }
}

/**
 * Search scholarly medical articles
 */
export async function searchMedicalArticles(query: string): Promise<SearchResponse> {
  try {
    // Search PubMed-focused sources
    const pubmedQuery = `${query} dialysis nephrology kidney`;
    const searchUrl = `https://api.duckduckgo.com/?q=site:pubmed.ncbi.nlm.nih.gov+${encodeURIComponent(pubmedQuery)}&format=json`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    const results: SearchResult[] = [];
    
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'PubMed Article',
        url: data.AbstractURL || '',
        snippet: data.Abstract,
        source: 'PubMed',
      });
    }

    return {
      results,
      query: pubmedQuery,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('PubMed search error:', error);
    return { results: [], query, timestamp: new Date().toISOString() };
  }
}

/**
 * Verify if a source is trusted
 */
export function isTrustedSource(url: string): boolean {
  return TRUSTED_SOURCES.some(source => url.includes(source));
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'Unknown Source';
  }
}

/**
 * Format search results for AI context
 */
export function formatSearchContext(searchResults: SearchResponse): string {
  if (searchResults.results.length === 0) {
    return 'No additional web sources found for verification.';
  }

  let context = '\n\n📚 VERIFIED MEDICAL SOURCES:\n';
  context += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  searchResults.results.forEach((result, index) => {
    const trustBadge = isTrustedSource(result.url) ? '✅ TRUSTED' : '⚠️ VERIFY';
    context += `\n${index + 1}. ${trustBadge} [${result.source}]\n`;
    context += `   "${result.snippet.substring(0, 200)}..."\n`;
    context += `   Source: ${result.url}\n`;
  });
  
  context += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  context += '⚠️ REQUIREMENT: Cite sources in your response using [Source: domain.com]';
  
  return context;
}

/**
 * Check if query needs web search
 */
export function needsWebSearch(query: string): boolean {
  const searchTriggers = [
    'what is',
    'what are',
    'how to',
    'why does',
    'explain',
    'define',
    'difference between',
    'best practices',
    'guidelines',
    'latest',
    'current',
    'recent studies',
    'research',
    'treatment for',
    'symptoms of',
    'causes of',
    'prevention',
    'management',
  ];

  const lowerQuery = query.toLowerCase();
  return searchTriggers.some(trigger => lowerQuery.includes(trigger));
}
