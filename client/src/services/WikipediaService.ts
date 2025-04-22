import axios from 'axios';
import { WikipediaResponse, WikipediaSearchResult, WikipediaPage, WikipediaImage, ConceptCard } from '../types/Wikipedia';
import { Tag } from '../config/tags';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

export class WikipediaService {
  private static instance: WikipediaService;
  private lastConceptId = 0;

  private constructor() {}

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

  public async searchArticles(theme: string, tags: Tag[] = [], limit: number = 5): Promise<ConceptCard[]> {
    try {
      // Build search query including tags
      const tagQuery = tags.length > 0 
        ? ` ${tags.map(tag => tag.name).join(' OR ')}` 
        : '';
      
      const searchQuery = `${theme}${tagQuery}`;

      // Search for articles
      const searchResponse = await axios.get<WikipediaResponse<WikipediaSearchResult>>(WIKIPEDIA_API_URL, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: searchQuery,
          srlimit: limit,
          format: 'json',
          origin: '*'
        }
      });

      const searchResults = searchResponse.data.query.search || [];
      const conceptCards: ConceptCard[] = [];

      // Process each article
      for (const result of searchResults) {
        // Get full article content
        const pageResponse = await axios.get<WikipediaResponse<WikipediaPage>>(WIKIPEDIA_API_URL, {
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
        });

        const page = Object.values(pageResponse.data.query.pages || {})[0];
        if (!page) continue;

        // Get the intro paragraph for the description
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
          tags: tags.map(tag => tag.name)
        };

        conceptCards.push(conceptCard);
      }

      return conceptCards;
    } catch (error) {
      console.error('Error fetching Wikipedia articles:', error);
      throw new Error('Failed to fetch Wikipedia articles');
    }
  }

  private truncateDescription(text: string): string {
    const words = text.split(' ');
    if (words.length <= 50) return text;
    
    // Take first 50 words and add ellipsis
    return words.slice(0, 50).join(' ') + '...';
  }
} 