import { reactive } from 'vue'
import type { UserData } from '../models/user'

export type Model = {
    readonly user: Readonly<UserData>,

    authenticate(user: UserData): void,
    logout(): void
}

export const model: Model = reactive({
    user: {
        username: '',
        password: '',
        token: '',
        userId: 0,
        admin: false
    } as UserData,

    authenticate(user: UserData) {
        this.user = { ...user }
    },
    
    logout() {
        this.user = {
            username: '',
            password: '',
            token: '',
            userId: 0,
            admin: false
        }
    }
})