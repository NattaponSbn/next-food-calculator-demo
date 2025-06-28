import { create } from 'zustand';
import React from 'react';

export type FilterValue = string | string[] | { condition: string; date: string } | undefined;

interface FilterState {
  isOpen: boolean;
  anchorElement: HTMLElement | null;
  content: React.ReactNode | null;
  resolve: ((value: { applied: boolean; value: FilterValue }) => void) | null;
  open: (content: React.ReactNode, anchorElement: HTMLElement) => Promise<{ applied: boolean; value: FilterValue }>;
  close: (result?: { applied: boolean; value: FilterValue }) => void;
}

const useFilterStore = create<FilterState>((set, get) => ({
  isOpen: false,
  anchorElement: null,
  content: null,
  resolve: null,
  open: (content, anchorElement) => new Promise((resolve) => {
    set({ isOpen: true, content, anchorElement, resolve });
  }),
  close: (result = { applied: false, value: undefined }) => {
    const { resolve } = get();
    if (resolve) resolve(result);
    set({ isOpen: false, content: null, anchorElement: null, resolve: null });
  },
}));

export const useFilter = () => {
  const { open, close } = useFilterStore();

  const showFilter = <TProps extends object>(
    filterComponent: React.ComponentType<TProps & { onApply: (value: any) => void; onClose: () => void }>,
    props: TProps,
    anchorElement: HTMLElement
  ) => {
    return open(
      React.createElement(filterComponent, {
        ...props,
        onApply: (value) => close({ applied: true, value }),
        onClose: () => close({ applied: false, value: undefined }),
      }),
      anchorElement
    );
  };

  return { showFilter, useFilterStore };
};
