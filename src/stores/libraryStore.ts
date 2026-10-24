import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LibraryFilters, ViewMode } from '@/features/library/types'

const defaultFilters: LibraryFilters = {
  search: '',
  sort: 'updated',
  model: 'all',
  tag: null,
  category: 'all',
  scope: { kind: 'all' },
}

interface LibraryState extends LibraryFilters {
  viewMode: ViewMode
  page: number
  setSearch: (value: string) => void
  setSort: (value: LibraryFilters['sort']) => void
  setModel: (value: LibraryFilters['model']) => void
  setTag: (value: LibraryFilters['tag']) => void
  setCategory: (value: LibraryFilters['category']) => void
  setScope: (value: LibraryFilters['scope']) => void
  setViewMode: (value: ViewMode) => void
  setPage: (value: number) => void
  resetFilters: () => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      ...defaultFilters,
      viewMode: 'grid',
      page: 1,
      // أي تغيير بالفلاتر بيرجّعنا للصفحة 1، وإلا ممكن نضل واقفين على صفحة صارت فاضية
      setSearch: (search) => set({ search, page: 1 }),
      setSort: (sort) => set({ sort, page: 1 }),
      setModel: (model) => set({ model, page: 1 }),
      setTag: (tag) => set({ tag, page: 1 }),
      setCategory: (category) => set({ category, page: 1 }),
      setScope: (scope) => set({ scope, page: 1 }),
      setViewMode: (viewMode) => set({ viewMode }),
      setPage: (page) => set({ page }),
      resetFilters: () => set({ ...defaultFilters, page: 1 }),
    }),
    {
      name: 'promptlab-library',
      version: 1,
      // بنحفظ بس شكل العرض (Grid/List). البحث والفلاتر بتبدأ نظيفة كل مرة
      partialize: (state) => ({ viewMode: state.viewMode }),
    },
  ),
)