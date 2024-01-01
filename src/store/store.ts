import { reactive } from 'vue';
import type { UserModel } from '../models/user';

export type Store = {
  readonly user: Readonly<UserModel>;

  authenticate(user: UserModel): void;
  logout(): void;
};

export const store: Store = reactive({
  user: {
    username: '',
    password: '',
    token: '',
    userId: 0,
    admin: false,
  } as UserModel,

  authenticate(user: UserModel) {
    this.user = { ...user };
  },

  logout() {
    this.user = {
      username: '',
      password: '',
      token: '',
      userId: 0,
      admin: false,
    };
  },
});
