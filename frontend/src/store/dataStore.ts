import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DataState {
    username: string
    storeUsername: (username: any) => void
    removeUsername: () => void
}

const useDataStore = create<DataState>()(
    devtools((set) => ({
        username: '',
        storeUsername: (username: any) => {
            set({
                username: username,
            })
        },
        removeUsername: () => set({ username: '' }),
    }))
)

export default useDataStore
