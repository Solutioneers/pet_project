export interface IPlayer {
    id: string
    symbol: 'X' | 'O' // Letter O, not number zero.
}

export interface IGame {
    id: string
    board: string[][]
    players: IPlayer[]
    currentPlayer: string
    status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
    winner: string | null
}

export interface IMove {
    playerId: string
    row: number
    column: number
}