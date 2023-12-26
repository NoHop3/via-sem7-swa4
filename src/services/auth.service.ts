import { model } from '@/store/store';
import axios from './base';

const API_URL = '/';

const authenticate = async (username: string, password: string) => {
  const response = await axios.post(API_URL + 'login', {
    username,
    password,
  });
  if (response.data) {
    localStorage.setItem('token', JSON.stringify(response.data));
    model.authenticate(response.data);

    return true;
  }

  return false;
};

const logout = () => {
  localStorage.removeItem('token');
};

const service = {
  authenticate,
  logout,
};

export default service;
