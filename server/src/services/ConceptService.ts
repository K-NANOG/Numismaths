import { Concept } from '../../../shared/types';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  pageUrl?: string;
  fullArticle?: string; // Store the complete Wikipedia article
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

export class ConceptService {
  private conceptsPath: string;
  private readonly likedConceptsPath: string;
  private concepts: Concept[] = [];
  private likedConceptIds: Set<string> = new Set();
  private initialized: Promise<void>;

  constructor() {
    this.conceptsPath = path.join(__dirname, '../concepts.json');
    this.likedConceptsPath = path.join(__dirname, '../liked_concepts.json');
    this.initialized = this.initializeService();
  }

  private async initializeService(): Promise<void> {
    try {
      // Ensure the files exist
      await this.ensureFiles();
      await this.loadInitialData();
    } catch (error) {
      console.error('Failed to initialize ConceptService:', error);
      // Initialize with default data
      this.concepts = [];
      this.likedConceptIds = new Set();
    }
  }

  private async ensureFiles(): Promise<void> {
    try {
      // Check if files exist, if not create them with default content
      await Promise.all([
        fs.access(this.conceptsPath).catch(() => fs.writeFile(this.conceptsPath, '[]')),
        fs.access(this.likedConceptsPath).catch(() => fs.writeFile(this.likedConceptsPath, '[]'))
      ]);
    } catch (error) {
      console.error('Error ensuring files exist:', error);
      throw error;
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      const [conceptsData, likedConceptsData] = await Promise.all([
        fs.readFile(this.conceptsPath, 'utf-8'),
        fs.readFile(this.likedConceptsPath, 'utf-8')
      ]);

      try {
        this.concepts = JSON.parse(conceptsData);
        const likedIds = JSON.parse(likedConceptsData);
        this.likedConceptIds = new Set(likedIds);

        // *** De-duplication Logic ***
        const seenConcepts = new Map<string, Concept>();
        this.concepts = this.concepts.filter(concept => {
          const uniqueKey = concept.pageUrl || `${concept.name}-${concept.description}`;
          if (!seenConcepts.has(uniqueKey)) {
            seenConcepts.set(uniqueKey, concept);
            return true; // Keep this concept
          } else {
            // If a duplicate is found, and the duplicate's ID is in the liked list,
            // we should update the liked list to use the original concept's ID.
            const existingConcept = seenConcepts.get(uniqueKey)!;
            if (this.likedConceptIds.has(concept.id)) {
              this.likedConceptIds.delete(concept.id);
              this.likedConceptIds.add(existingConcept.id);
            }
            return false; // Filter out this duplicate
          }
        });
        // *** End De-duplication Logic ***

      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        // If JSON is invalid, initialize with empty data
        this.concepts = [];
        this.likedConceptIds = new Set();
        // Save empty data to fix corrupted files
        await this.saveToFile();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      throw error;
    }
  }

  private async saveToFile(): Promise<void> {
    try {
      await Promise.all([
        fs.writeFile(this.conceptsPath, JSON.stringify(this.concepts, null, 2)),
        fs.writeFile(this.likedConceptsPath, JSON.stringify([...this.likedConceptIds], null, 2))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  async getAllConcepts(): Promise<Concept[]> {
    try {
      await this.initialized;
      return this.concepts;
    } catch (error) {
      console.error('Error getting all concepts:', error);
      throw new Error('Failed to get concepts');
    }
  }

  async getLikedConcepts(): Promise<Concept[]> {
    try {
      await this.initialized;
      return this.concepts.filter(concept => this.likedConceptIds.has(concept.id));
    } catch (error) {
      console.error('Error getting liked concepts:', error);
      throw new Error('Failed to get liked concepts');
    }
  }

  async addNewConcept(concept: Concept): Promise<void> {
    try {
      await this.initialized;
      // Check if a concept with the same pageUrl already exists (for Wikipedia concepts)
      const existingIndex = this.concepts.findIndex(c => c.pageUrl && c.pageUrl === concept.pageUrl);
      
      if (existingIndex === -1) {
        // If it's a new concept, ensure it has a unique ID
        if (!concept.id) {
          concept.id = await this.getNextConceptId();
        }
        this.concepts.push(concept);
      } else {
        this.concepts[existingIndex] = concept;
      }

      await this.saveToFile();
    } catch (error) {
      console.error('Error adding new concept:', error);
      throw new Error('Failed to add new concept');
    }
  }

  async saveLikedConcept(conceptId: string, newConcept?: Concept): Promise<void> {
    try {
      await this.initialized;
      
      // Check if concept is already liked
      if (this.likedConceptIds.has(conceptId)) {
        throw new Error('Concept is already in your numidex');
      }

      if (newConcept) {
        await this.addNewConcept(newConcept);
      }

      this.likedConceptIds.add(conceptId);
      await this.saveToFile();
    } catch (error) {
      console.error('Error saving liked concept:', error);
      throw error;
    }
  }

  async getActionHistory(): Promise<ConceptAction[]> {
    await this.initialized;
    return []; // Simplified for now
  }

  // Helper method to get the next available concept ID
  async getNextConceptId(): Promise<string> {
    try {
      await this.initialized;
      const existingIds = this.concepts.map(c => parseInt(c.id.split('_')[1]));
      const maxId = Math.max(0, ...existingIds);
      return `concept_${(maxId + 1).toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating next concept ID:', error);
      throw new Error('Failed to generate concept ID');
    }
  }
}

// Export a singleton instance
export const conceptService = new ConceptService(); 