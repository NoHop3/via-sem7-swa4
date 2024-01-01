import { reactive } from 'vue';
import type { UserModel } from '../models/user';
import type { GameModel, PlayDataModel } from '@/models/game';
import * as BoardModel from '@/models/board';

export type Store = {
  games: GameModel[];
  readonly game: Readonly<GameModel>;
  readonly play: Readonly<PlayDataModel>;
  readonly user: Readonly<UserModel>;

  setGameData(game: GameModel): void;
  initializeNewBoard(): void;
  setBoard(board: BoardModel.Board<string>): void;
  increaseScore(score: number): void;
  decreaseMoves(): void;
  endGame(): void;
  emptyGameData(): void;

  setSelectedPiece(position: BoardModel.Position | undefined): void;
  setMessage(message: string): void;
  setMatches(positions: BoardModel.Position[]): void;
  clearMatches(): void;
  setCalculatingMove(calculatingMove: boolean): void;

  authenticate(user: UserModel): void;
  logout(): void;
};

const generator: BoardModel.CyclicGenerator = new BoardModel.CyclicGenerator('A,B,C,D,E');
const initBoard = BoardModel.create(generator, 8, 8);
BoardModel.handleMatches(BoardModel.checkMatches(initBoard), initBoard, generator, []);

export const store: Store = reactive({
  games: [] as GameModel[],
  game: {
    user: 0,
    id: 0,
    board: initBoard,
    score: 0,
    nrOfMoves: 10,
    completed: false,
  } as GameModel,
  play: {
    selectedPiece: undefined,
    message: '',
    matches: [],
    calculatingMove: false,
  } as PlayDataModel,
  user: {
    username: '',
    password: '',
    token: '',
    userId: 0,
    admin: false,
  } as UserModel,

  setGameData(game: GameModel) {
    this.game = { ...game };
    if (!game.nrOfMoves) {
      this.game.nrOfMoves = 10;
    }
  },
  initializeNewBoard() {
    const initBoard = BoardModel.create(generator, 8, 8);
    BoardModel.handleMatches(BoardModel.checkMatches(initBoard), initBoard, generator, []);
    this.game = { ...this.game, board: initBoard };
  },
  setBoard(board: BoardModel.Board<string>) {
    this.game.board = { ...board };
  },
  increaseScore(score: number) {
    this.game.score += score;
  },
  decreaseMoves() {
    --this.game.nrOfMoves;
  },
  endGame() {
    this.game.completed = true;
  },
  emptyGameData() {
    this.game = {
      user: 0,
      id: 0,
      board: initBoard,
      score: 0,
      nrOfMoves: 10,
      completed: false,
    };
  },

  setSelectedPiece(position: BoardModel.Position | undefined) {
    this.play.selectedPiece = position ? { row: position.row, col: position.col } : undefined;
  },
  setMessage(message: string) {
    this.play.message = message;
  },
  setMatches(positions: BoardModel.Position[]) {
    this.play.matches.push(...positions);
  },
  clearMatches() {
    this.play.matches = [];
  },
  setCalculatingMove(calculatingMove: boolean) {
    this.play.calculatingMove = calculatingMove;
  },

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
