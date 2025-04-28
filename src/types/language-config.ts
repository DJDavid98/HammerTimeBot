import { TranslationCreditOverride } from './translation-credit-override.js';

export interface LanguageConfigV2 {
  /**
   * Language name in English
   */
  name: string;
  emoji?: string;
  creditOverrides?: Record<string | number, TranslationCreditOverride | null>;
}


export type LatestLanguageConfigType = LanguageConfigV2;
