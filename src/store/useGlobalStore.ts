import { create } from "zustand"


interface GlobalStore {
  loading: boolean

  setLoading: (loading: boolean) => void
}

const useGlobalStore = create<GlobalStore>((set) => ({
  loading: false,

  setLoading: (loading: boolean) => set({ loading })
}))

export default useGlobalStore