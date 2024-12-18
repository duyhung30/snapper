import { create } from "zustand";
import { AvatarStore } from "@/types/type";

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  // Store avatars mapped by user ID
  avatars: {},

  // Get avatar URL for a specific user
  getAvatarUrl: (userId: string) => {
    if (!userId) return null;
    return get().avatars[userId] || null;
  },

  // Set avatar URL for a specific user
  setAvatarUrl: (userId: string, url: string) =>
    set((state) => ({
      avatars: {
        ...state.avatars,
        [userId]: url
      }
    })),

  // Clear all stored avatars
  clearAvatars: () => set({ avatars: {} })
}));
