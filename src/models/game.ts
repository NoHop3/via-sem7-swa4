import { Board, Position } from "./board";

export interface GameModel {
  user: number;
  id: number;
  board: Board<string>;
  score: number;
  nrOfMoves: number;
  completed: boolean;
}

export interface PlayDataModel {
  selectedPiece: Position | undefined;
  message: string;
  matches: Position[];
  calculatingMove: boolean;
}