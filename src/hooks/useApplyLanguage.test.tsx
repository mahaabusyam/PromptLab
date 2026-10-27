// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { en } from '@/i18n/locales/en';
import { useLanguageStore } from '@/stores/languageStore';
import { useApplyLanguage } from './useApplyLanguage';

const STORAGE_KEY = 'promptlab-language';

function mockBrowserLanguages(languages: string[]): void {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
}

describe('useApplyLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ preference: 'auto' });
    mockBrowserLanguages(['en-US']);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();
    useLanguageStore.setState({ preference: 'auto' });
    await i18n.changeLanguage('en');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  it('starts in English (LTR) when the browser is English', () => {
    renderHook(() => useApplyLanguage());

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('switching to Arabic sets lang, dir="rtl" and translates the UI', async () => {
    renderHook(() => useApplyLanguage());

    act(() => useLanguageStore.getState().setPreference('ar'));

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    await waitFor(() => expect(i18n.resolvedLanguage).toBe('ar'));
    expect(i18n.t('common.cancel')).not.toBe(en.common.cancel);
  });

  it('switching back to English restores LTR and the English text', async () => {
    renderHook(() => useApplyLanguage());

    act(() => useLanguageStore.getState().setPreference('ar'));
    await waitFor(() => expect(i18n.resolvedLanguage).toBe('ar'));

    act(() => useLanguageStore.getState().setPreference('en'));

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    await waitFor(() => expect(i18n.t('common.cancel')).toBe(en.common.cancel));
  });

  it('"auto" follows an Arabic browser', () => {
    mockBrowserLanguages(['ar-EG', 'en-US']);

    renderHook(() => useApplyLanguage());

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('a manual choice wins over the browser language', () => {
    mockBrowserLanguages(['ar-EG']);
    useLanguageStore.setState({ preference: 'en' });

    renderHook(() => useApplyLanguage());

    expect(document.documentElement.dir).toBe('ltr');
  });
});

describe('language preference storage', () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ preference: 'auto' });
  });

  afterEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ preference: 'auto' });
  });

  it('is restored from localStorage after a reload', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { preference: 'ar' }, version: 1 }));

    await useLanguageStore.persist.rehydrate();

    expect(useLanguageStore.getState().preference).toBe('ar');
  });

  it('falls back to "auto" when the stored value is not a supported choice', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { preference: 'fr' }, version: 1 }));

    await useLanguageStore.persist.rehydrate();

    expect(useLanguageStore.getState().preference).toBe('auto');
  });

  it('saves a new choice', () => {
    useLanguageStore.getState().setPreference('ar');

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      state?: { preference?: string };
    };
    expect(saved.state?.preference).toBe('ar');
  });
});