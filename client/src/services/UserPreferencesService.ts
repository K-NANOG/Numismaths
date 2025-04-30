import { Tag } from '../config/tags';

export class UserPreferencesService {
  private static instance: UserPreferencesService;
  private readonly STORAGE_KEY = 'user_preferences';
  private preferences: {
    selectedTags: Tag[];
  };

  private constructor() {
    this.preferences = this.loadPreferences();
  }

  public static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  private loadPreferences(): { selectedTags: Tag[] } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    return { selectedTags: [] };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  public getSelectedTags(): Tag[] {
    return this.preferences.selectedTags;
  }

  public setSelectedTags(tags: Tag[]): void {
    this.preferences.selectedTags = tags;
    this.savePreferences();
  }

  public addTag(tag: Tag): void {
    if (!this.preferences.selectedTags.some(t => t.id === tag.id)) {
      this.preferences.selectedTags.push(tag);
      this.savePreferences();
    }
  }

  public removeTag(tagId: string): void {
    this.preferences.selectedTags = this.preferences.selectedTags.filter(t => t.id !== tagId);
    this.savePreferences();
  }

  public clearTags(): void {
    this.preferences.selectedTags = [];
    this.savePreferences();
  }
} 