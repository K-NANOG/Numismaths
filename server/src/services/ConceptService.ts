import fs from 'fs/promises';
import path from 'path';
import process from 'process';

export interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  visuals: Array<{
    type: string;
    url: string;
    description: string;
  }>;
}

export interface ConceptAction {
  conceptId: string;
  action: 'like' | 'dislike';
  timestamp: number;
  userId?: string; // For future authentication implementation
}

class ConceptService {
  private readonly conceptsPath: string;
  private likedConceptIds: Set<string> = new Set();

  constructor() {
    this.conceptsPath = path.join(process.cwd(), 'src', 'concepts.json');
  }

  async getAllConcepts(): Promise<Concept[]> {
    try {
      const data = await fs.readFile(this.conceptsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading concepts:', error);
      throw new Error('Failed to load concepts');
    }
  }

  async getLikedConcepts(): Promise<Concept[]> {
    try {
      const allConcepts = await this.getAllConcepts();
      return allConcepts.filter(concept => this.likedConceptIds.has(concept.id));
    } catch (error) {
      console.error('Error getting liked concepts:', error);
      throw new Error('Failed to get liked concepts');
    }
  }

  async saveLikedConcept(conceptId: string): Promise<void> {
    try {
      this.likedConceptIds.add(conceptId);
    } catch (error) {
      console.error('Error saving liked concept:', error);
      throw new Error('Failed to save liked concept');
    }
  }

  async getActionHistory(): Promise<ConceptAction[]> {
    return []; // Simplified for now
  }
}

export const conceptService = new ConceptService(); 