export interface WikipediaSearchResult {
  pageid: number;
  title: string;
  snippet: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface WikipediaPage {
  pageid: number;
  title: string;
  extract: string;
  fullurl: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface WikipediaImage {
  title: string;
  imageinfo: Array<{
    url: string;
    descriptionurl: string;
    descriptionshorturl: string;
  }>;
}

export interface WikipediaResponse<T> {
  query: {
    search?: WikipediaSearchResult[];
    pages?: { [key: string]: WikipediaPage };
    images?: WikipediaImage[];
  };
}

export interface ConceptCard {
  id: string;
  name: string;
  category: string;
  description: string;
  fullArticle?: string;
  pageUrl?: string;
  visuals: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
} 