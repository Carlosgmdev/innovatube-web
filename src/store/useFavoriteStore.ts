import { create } from "zustand";
import { Favorite } from "../types/favorite";


interface FavoriteStore {
  favorites: Favorite[] | null

  setFavorites: (favorites: Favorite[]) => void
  removeFavorite: (favorite: Favorite) => void
}

const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: null,

  setFavorites: (favorites) => set({ favorites }),
  removeFavorite: (favorite) => set({ favorites: get().favorites?.filter(f => f.id !== favorite.id) || [] })
}))

export default useFavoriteStore