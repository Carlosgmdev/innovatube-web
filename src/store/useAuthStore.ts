import { create } from "zustand"
import { User } from "../types/auth"


interface AuthStore {
  user: User | null

  setUser: (user: User) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (user: User) => set({ user })
}))

export default useAuthStore