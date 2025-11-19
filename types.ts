export enum AppStep {
  IDEA = 'IDEA',
  DEV_GUIDE = 'DEV_GUIDE',
  STORE_LISTING = 'STORE_LISTING',
  POLICY = 'POLICY',
  PUBLISH = 'PUBLISH'
}

export type Language = 'en' | 'tr';

export interface StoreListingData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  keywords: string[];
}

export interface AppConcept {
  name: string;
  description: string;
  targetAudience: string;
  monetization: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export type GeminiLoadingState = 'idle' | 'loading' | 'success' | 'error';