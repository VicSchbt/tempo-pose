import type { ImageItem } from '@/types/core';
import type { StateCreator } from 'zustand';

export type ImagesSlice = {
  images: ImageItem[];
  addImages: (items: ImageItem[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
};

export const createImagesSlice: StateCreator<
  ImagesSlice,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  ImagesSlice
> = (set, get) => ({
  images: [],

  addImages: (items) =>
    set(
      (state) => {
        // Optional dedupe by name+size; adapt if you store hashes later
        const existing = new Set(state.images.map((i) => `${i.name}|${i.file.size}`));
        const toAdd = items.filter((i) => !existing.has(`${i.name}|${i.file.size}`));
        return { images: [...state.images, ...toAdd] };
      },
      false,
      'images/addImages',
    ),

  removeImage: (id) =>
    set(
      (state) => {
        const target = state.images.find((i) => i.id === id);
        if (target) URL.revokeObjectURL(target.url);
        return { images: state.images.filter((i) => i.id !== id) };
      },
      false,
      'images/removeImage',
    ),

  clearImages: () =>
    set(
      (state) => {
        state.images.forEach((i) => URL.revokeObjectURL(i.url));
        return { images: [] };
      },
      false,
      'images/clearImages',
    ),
});
