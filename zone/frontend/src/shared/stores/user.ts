import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import IUser from '../models/user'

type State = {
    isLoading: boolean
    user: IUser | null
}

type Actions = {
    setUser: (user: IUser | null) => void
    setLoading: (isLoading: boolean) => void
}

export const useUserStore = create(
    immer<State & Actions>((set) => ({
        user: null,
        isLoading: true,
        setUser: (user: IUser | null) => {
            set((state) => {
                state.user = user;
            })
        },
        setLoading: (isLoading: boolean) => {
            set((state) => {
                state.isLoading = isLoading;
            })
        }
    }))
)