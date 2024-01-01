import axios from './base';
import { GameModel } from '@/models/game';

export const updateGame = async (token: string, id: number, gameData: GameModel) => {
  const response = await axios.put('http://localhost:9090/games/' + id + '?token=' + token, gameData);
  if (response.data) {
    return response.data;
  }
};

export const getAllGames = async (token: string) => {
  const response = await axios.get('http://localhost:9090/games?token=' + token);
  if (response.data) {
    return response.data;
  }
};

export const startNewGame = async (token: string) => {
  const response = await axios.post('http://localhost:9090/games?token=' + token);
  if (response.data) {
    return response.data;
  }
};

export const getGameById = async (token: string, id: number) => {
  const response = await axios.get('http://localhost:9090/games/' + id + '?token=' + token);
  if (response.data) {
    return response.data;
  }
};
