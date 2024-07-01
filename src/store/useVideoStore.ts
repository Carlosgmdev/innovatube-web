import { create } from "zustand";
import { Item, Videos } from "../types/video";


interface VideoStore {
  videos: Videos | null
  favorites: Item[] | null

  setVideos: (videos: Videos) => void
  addFavoriteVideo: (video: Item) => void
  removeFavoriteVideo: (video: Item) => void
  removeFavoriteVideoById: (id: string) => void
}

const useVideoStore = create<VideoStore>((set, get) => ({
  videos: null,
  favorites: null,

  setVideos: (videos) => set({ videos }),
  addFavoriteVideo: (video: Item) => set({ favorites: [...get().favorites || [], video]}),
  removeFavoriteVideo: (video: Item) => set({ favorites: get().favorites?.filter(v => v.id.videoId !== video.id.videoId) || []}),
  removeFavoriteVideoById: (id: string) => set({ favorites: get().favorites?.filter(v => v.id.videoId !== id) || []}),
}))

export default useVideoStore