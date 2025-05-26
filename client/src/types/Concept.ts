export interface Visual {
  type: string;
  url: string;
  description: string;
}

export interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  fullArticle?: string;
  visuals: Visual[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  wikipediaUrl?: string;
  pageUrl?: string; // For backward compatibility with existing data
} 