import { create } from "zustand";

interface SearchStore {
  keyword: string;

  setKeyword: (keyword: string) => void;

  clearKeyword: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: "",

  setKeyword: (keyword) =>
    set({
      keyword,
    }),

  clearKeyword: () =>
    set({
      keyword: "",
    }),
}));