import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DataState {
    username: string
    storeUsername: (username: string) => void
    removeUsername: () => void
}

const useDataStore = create<DataState>()(
    devtools((set) => ({
        username: '',
        storeUsername: (username: string) => {
            set({
                username: username,
            })
        },
        removeUsername: () => set({ username: '' }),
    }))
)

export default useDataStore
