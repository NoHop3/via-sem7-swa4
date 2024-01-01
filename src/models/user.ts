export interface UserModel {
  username: string;
  password: string;
  token: string;
  userId: number;
  admin?: boolean;
}
