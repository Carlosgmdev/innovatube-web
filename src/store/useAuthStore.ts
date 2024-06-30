import { create } from "zustand"
import { User } from "../types/auth"


interface AuthStore {
  user: User | null
  token: string | null

  setUser: (user: User) => void
  setToken: (token: string) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token })
}))

export default useAuthStore