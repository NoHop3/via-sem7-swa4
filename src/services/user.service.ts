import { store } from '@/store/store';
import axios from './base';

const API_URL = '/';

export const authenticate = async (username: string, password: string) => {
  const response = await axios.post(API_URL + 'login', {
    username,
    password,
  });
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data));
    store.authenticate(response.data);

    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUser = async (token: string, id: number) => {
  const response = await axios.get(API_URL + 'users/' + id + '?token=' + token);
  if (response.data) {
    return response.data;
  }
};

export const changePassword = async (token: string, newPassword: string, id: number) => {
  const response = await axios.put(API_URL + 'users/' + id + '?token=' + token, {
    password: newPassword,
  });
  if (response.data) {
    return response.data;
  }
};
