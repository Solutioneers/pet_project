import { IGame, IPlayer } from '../utility/interfaces'

export class Game implements IGame {
    id: string
    board: string[][]
    players: IPlayer[]
    currentPlayer: string
    status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
    winner: string | null

    /**
     * Creates an instance of Game.
     */
    constructor() {
        this.id = this.generateUniqueId()
        this.board = this.createEmptyBoard()
        this.players = []
        this.currentPlayer = ''
        this.status = 'WAITING'
        this.winner = null
    }

    generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9)
    }

    private createEmptyBoard(): string[][] {
        return [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]
    }

    addPlayer(player: IPlayer): void {
        this.players.push(player)
    }

    start(): void {
        this.status = 'IN_PROGRESS'
        this.currentPlayer = this.players[0].id
    }

    /**
     * Makes a move on the board.
     * @param {string} playerId - The player's id.
     * @param {number} row - The row of the board.
     * @param {number} column - The column of the board.
     * @returns {void}
     */
    makeMove(playerId: string, row: number, column: number): void {
        this.board[row][column] = this.players.find((p) => p.id === playerId)!.symbol
        this.nextPlayer()
    }

    /**
     * Switches to the next player.
     * @returns {void}
     */
    nextPlayer(): void {
        this.currentPlayer = this.players.find((p) => p.id !== this.currentPlayer)!.id
    }

    /**
     * Checks if there is a win or a draw on the board.
     * @returns {void}
     */
    checkForWinner(): void {
        const winningCombinations = [
            // horizontal
            [
                [0, 0],
                [0, 1],
                [0, 2],
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2],
            ],
            [
                [2, 0],
                [2, 1],
                [2, 2],
            ],
            // vertical
            [
                [0, 0],
                [1, 0],
                [2, 0],
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1],
            ],
            [
                [0, 2],
                [1, 2],
                [2, 2],
            ],
            // diagonal
            [
                [0, 0],
                [1, 1],
                [2, 2],
            ],
            [
                [0, 2],
                [1, 1],
                [2, 0],
            ],
        ]

        for (const combination of winningCombinations) {
            const [a, b, c] = combination

            if (
                this.board[a[0]][a[1]] !== '' &&
                this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
                this.board[a[0]][a[1]] === this.board[c[0]][c[1]]
            ) {
                this.status = 'FINISHED'
                this.winner = this.board[a[0]][a[1]]
                return
            }
        }

        if (this.board.every((row) => row.every((cell) => cell !== ''))) {
            this.status = 'FINISHED'
            this.winner = 'DRAW'
        }
    }
}
