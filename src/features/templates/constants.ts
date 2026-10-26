import i18n from 'i18next';
import '@/i18n';
import type { TemplateComplexity } from './schemas';
import type { TemplateSort } from './types';

// Getters: the label is looked up when read, so it follows the current language.
// Object.keys() still works (the keys are enumerable) and does not call the getters.
export const complexityLabels: Record<TemplateComplexity, string> = {
  get 'zero-shot'() {
    return i18n.t('templates.complexity.zeroShot');
  },
  get 'few-shot'() {
    return i18n.t('templates.complexity.fewShot');
  },
  get 'multi-agent'() {
    return i18n.t('templates.complexity.multiAgent');
  },
};

export const sortLabels: Record<TemplateSort, string> = {
  get featured() {
    return i18n.t('templates.sort.featured');
  },
  get name() {
    return i18n.t('templates.sort.name');
  },
  get tokens() {
    return i18n.t('templates.sort.tokens');
  },
  get variables() {
    return i18n.t('templates.sort.variables');
  },
};

export const TEMPLATES_PAGE_SIZE = 8;