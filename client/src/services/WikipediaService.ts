import axios from 'axios';
import { WikipediaResponse, WikipediaSearchResult, WikipediaPage, WikipediaImage, ConceptCard } from '../types/Wikipedia';
import { Tag } from '../config/tags';
import { UserPreferencesService } from './UserPreferencesService';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

export class WikipediaService {
  private static instance: WikipediaService;
  private lastConceptId = 0;
  private userPreferences: UserPreferencesService;

  private constructor() {
    this.userPreferences = UserPreferencesService.getInstance();
  }

  public static getInstance(): WikipediaService {
    if (!WikipediaService.instance) {
      WikipediaService.instance = new WikipediaService();
    }
    return WikipediaService.instance;
  }

  private generateConceptId(): string {
    this.lastConceptId++;
    return `concept_${this.lastConceptId.toString().padStart(3, '0')}`;
  }

  private determineDifficulty(extract: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    const wordCount = extract.split(/\s+/).length;
    if (wordCount < 200) return 'Beginner';
    if (wordCount < 500) return 'Intermediate';
    return 'Advanced';
  }

  private async getArticleImages(pageId: number): Promise<WikipediaImage[]> {
    try {
      const response = await axios.get<WikipediaResponse<WikipediaImage>>(WIKIPEDIA_API_URL, {
        params: {
          action: 'query',
          prop: 'images',
          pageids: pageId,
          format: 'json',
          origin: '*'
        }
      });

      return response.data.query.images || [];
    } catch (error) {
      console.error('Error fetching article images:', error);
      return [];
    }
  }

  private async getImageUrl(imageTitle: string): Promise<string | null> {
    try {
      const response = await axios.get<WikipediaResponse<WikipediaImage>>(WIKIPEDIA_API_URL, {
        params: {
          action: 'query',
          prop: 'imageinfo',
          titles: imageTitle,
          iiprop: 'url',
          format: 'json',
          origin: '*'
        }
      });

      const imageInfo = response.data.query.images?.[0]?.imageinfo?.[0];
      return imageInfo?.url || null;
    } catch (error) {
      console.error('Error fetching image URL:', error);
      return null;
    }
  }

  // Retry logic with exponential backoff
  private async fetchWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying Wikipedia API call (${retries} left)...`, error);
        await new Promise(res => setTimeout(res, delay));
        return this.fetchWithRetry(fn, retries - 1, delay * 2);
      } else {
        throw error;
      }
    }
  }

  /**
   * Search Wikipedia articles with pagination and robust error handling.
   * @param theme Search theme
   * @param tags Tags to include
   * @param limit Number of results to fetch (default 10)
   * @param offset Offset for pagination (default 0)
   */
  public async searchArticles(theme: string, tags: Tag[] = [], limit: number = 10, offset: number = 0): Promise<ConceptCard[]> {
    try {
      const searchTags = tags.length > 0 ? tags : this.userPreferences.getSelectedTags();
      const tagQuery = searchTags.length > 0 
        ? ` ${searchTags.map(tag => tag.name).join(' OR ')}` 
        : '';
      const searchQuery = `${theme}${tagQuery}`;

      // Log the search request
      console.log('[WikipediaService] Searching articles:', { searchQuery, limit, offset });

      // Search for articles (with retry)
      const searchResponse = await this.fetchWithRetry(() => axios.get<WikipediaResponse<WikipediaSearchResult>>(WIKIPEDIA_API_URL, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: searchQuery,
          srlimit: limit,
          sroffset: offset,
          format: 'json',
          origin: '*'
        }
      }));

      if (!searchResponse.data || !searchResponse.data.query || !searchResponse.data.query.search) {
        console.error('[WikipediaService] Invalid search response:', searchResponse.data);
        throw new Error('Wikipedia API returned invalid search response');
      }

      const searchResults = searchResponse.data.query.search || [];
      const conceptCards: ConceptCard[] = [];

      // Process each article
      for (const result of searchResults) {
        try {
          // Get full article content (with retry)
          const pageResponse = await this.fetchWithRetry(() => axios.get<WikipediaResponse<WikipediaPage>>(WIKIPEDIA_API_URL, {
            params: {
              action: 'query',
              prop: 'extracts|pageimages|info',
              pageids: result.pageid,
              exintro: false,
              explaintext: true,
              piprop: 'thumbnail',
              pithumbsize: 300,
              inprop: 'url',
              format: 'json',
              origin: '*'
            }
          }));

          const page = Object.values(pageResponse.data.query.pages || {})[0];
          if (!page) continue;

          const introParagraph = page.extract.split('\n\n')[0];
          const truncatedDescription = this.truncateDescription(introParagraph);

          const conceptCard: ConceptCard = {
            id: this.generateConceptId(),
            name: page.title,
            category: theme,
            description: truncatedDescription,
            fullArticle: page.extract,
            pageUrl: page.fullurl,
            visuals: [],
            difficulty: this.determineDifficulty(page.extract),
            tags: searchTags.map(tag => tag.name)
          };

          conceptCards.push(conceptCard);
        } catch (pageError) {
          console.error('[WikipediaService] Error fetching page details:', pageError);
        }
      }

      // Log the results
      console.log(`[WikipediaService] Fetched ${conceptCards.length} concepts (offset ${offset})`);
      return conceptCards;
    } catch (error) {
      console.error('[WikipediaService] Error fetching Wikipedia articles:', error);
      throw new Error('Failed to fetch Wikipedia articles');
    }
  }

  private truncateDescription(text: string): string {
    const words = text.split(' ');
    if (words.length <= 50) return text;
    return words.slice(0, 50).join(' ') + '...';
  }
} 