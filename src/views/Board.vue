<template>
    <div class="main">
        <div v-show="playStarted">
            <button v-show="!store.play.calculatingMove" @click="backToMain">Back to main page</button>
            <div v-show="!store.game.completed">
                <div>YOUR SCORE: {{ store.game.score }}</div>
                <div>MOVES LEFT: {{ store.game.nrOfMoves }}</div>
            </div>
            <div v-show="store.game.completed && store.game.nrOfMoves === 0" class="text-success">
                Final score: {{ store.game.score }} points.
            </div>
            <div v-for="(row, rowIndex) in store.game.board?.grid" :key="'Row' + rowIndex" class="board">
                <button class='element row-element' v-for="(element, colIndex) in row" :key="'Tile' + rowIndex + ',' + colIndex"
                        :class="[element, { 'row-element--selected': isSelected(rowIndex, colIndex) }]"
                        @click="() => selectedElement(rowIndex, colIndex, element)">
                </button>
            </div>
        </div>

        <div v-show="!playStarted && store.games">
            <h2 v-if="hasUnfinishedGames">Unfinished games:</h2>
            <div class='container' v-if="hasUnfinishedGames">
                <div class='row'>
                    <button class="btn" v-for="game in unfinishedGames" :key="game.id" @click="() => continueGame(game.id)">
                        GAME {{ game.id }}
                    </button>
                </div>
            </div>
            <div>
                <h2>Start a new game:</h2>
                <button class="btn" @click="startAnotherGame">NEW GAME</button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import * as api from '../services/game.service';
import { store } from '../store/store';
import * as BoardModel from '../models/board';
import { defineComponent } from "vue";

export default {
    data() {
        return {
            playStarted: false,
            selected: false,
            store: store,
            generator: new BoardModel.CyclicGenerator('A,B,C,D,E'),
        };
    },
    computed: {
        unfinishedGames() {
            return this.store.games.filter(game => !game.completed && game.user === this.store.user.userId);
        },
        hasUnfinishedGames() {
            return this.unfinishedGames.length > 0;
        }
    },
    methods: {

        backToMain() {
            this.playStarted = false;
        },

        async continueGame(id: number) {
            this.playStarted = false;
            this.store.emptyGameData();
            let hasBoard = true;
            try {
                const result = await api.getGameById(this.store.user.token, id);
                this.store.setGameData(result);
                hasBoard = !!result.board;

                if (!hasBoard) {
                    this.store.initializeNewBoard();
                    await api.updateGame(this.store.user.token, this.store.game.id, this.store.game);
                }

                this.playStarted = true;
            } catch (error) {
                console.error('Error in continueGame:', error);
            }
        },

        async startAnotherGame() {
            this.playStarted = false;
            this.store.emptyGameData();
            this.store.initializeNewBoard();
            try {
                const result = await api.startNewGame(this.store.user.token);
                await api.updateGame(this.store.user.token, result.id, {
                    ...this.store.game, id: result.id, user: this.store.user.userId
                });
                this.store.setGameData({ ...this.store.game, id: result.id });
                this.playStarted = true;
            } catch (error) {
                console.error('Error in startAnotherGame:', error);
            }
        },

        async selectedElement(rowIndex: number, colIndex: number, element: any) {
            if (!store.play.calculatingMove && !store.game.completed) {
                this.selected = true;
                if (store.play.selectedPiece) {
                    store.setCalculatingMove(true) // block user for making other moves until we resolve this
                    const moveResults = BoardModel.move(this.generator, { ...store.game.board }, store.play.selectedPiece, { row: rowIndex, col: colIndex })
                    if (moveResults.effects.length > 0) {
                        store.decreaseMoves() //made a valid move, decrease nr of moves left this game
                        const newBoard: BoardModel.Board<string> = JSON.parse(JSON.stringify(store.game.board)) as typeof store.game.board;
                        newBoard.grid[store.play.selectedPiece.row][store.play.selectedPiece.col] = BoardModel.piece(newBoard, { row: rowIndex, col: colIndex })!;
                        newBoard.grid[rowIndex][colIndex] = BoardModel.piece(store.game.board, store.play.selectedPiece)!;
                        store.setBoard(newBoard);
                        store.setSelectedPiece(undefined)
                        this.selected = false;
                        for (let effect of moveResults.effects) {
                            if (effect.kind === 'Match') {
                                if (effect.match?.positions.length) {
                                    store.increaseScore((effect.match?.positions.length - 2) * 100)
                                }
                                store.setMatches(effect.match?.positions ? effect.match?.positions : [])
                            } else {
                                store.setMessage("Making refill")
                                setTimeout(() => {}, 1000)
                                store.setBoard(moveResults.board)
                                store.setMessage('')
                                store.clearMatches()
                            }
                        }
                        setTimeout(() => {}, 1000)
                    } else {
                        store.setMessage("CAN'T MAKE MOVE");
                        setTimeout(() => {
                            store.setMessage('')
                        }, 1000);
                    }
                    store.setSelectedPiece(undefined);
                    this.selected = false;
                    store.setCalculatingMove(false);

                    if (!store.play.calculatingMove) {
                        if (store.game.nrOfMoves === 0) {
                            store.endGame();
                            api.updateGame(store.user.token!, store.game.id, { ...store.game, completed: true })
                        } else {
                            api.updateGame(store.user.token!, store.game.id, store.game)
                        }
                    }
                } else {
                    store.setSelectedPiece({ row: rowIndex, col: colIndex })
                    this.selected = false;
                }
            }
        },
        isSelected(rowIndex: number, colIndex: number) {
            return this.selected
                || (this.store.play.selectedPiece?.row === rowIndex && this.store.play.selectedPiece.col === colIndex)
                || this.store.play.matches.some((pos) => pos.row === rowIndex && pos.col === colIndex);
        }
    },
    mounted() {
        const findGames = async () => {
            if (this.store.user.token) {
                const result = await api.getAllGames(this.store.user.token);
                if (result) this.store.games = result;
            }
            setTimeout(findGames, 5000);
        };
        findGames();
    }
}
</script>


<style scoped >
.board {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.row {
  margin-left: 1rem;
}

.btn {
    margin: 0.3rem;
    width: 8rem;
}


.row-element {
    background-size: cover;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    background-color: aliceblue;
    margin: 5px;
}

.row-element--selected {
    border: 4px solid transparent;
    background-color: rgb(255, 0, 238);
}

button.row-element {
  border: 2px solid transparent;
  width: 4rem;
  height: 4rem;

}

.row-element.A {
  background-image: url('../assets/candyOne.png');
}

.row-element.B {
  background-image: url('../assets/candyTwo.png');
}

.row-element.C {
  background-image: url('../assets/candyThree.png');
}

.row-element.D {
  background-image: url('../assets/candyFour.png');
}

.row-element.E {
  background-image: url('../assets/candyFive.png');
}
</style>