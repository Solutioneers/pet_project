import httpStatus from 'http-status'
import { Game } from '../models/Game'
import { RequestError } from './RequestError'
import { IPlayer } from './interfaces'

export const validateJoinGame = (game: Game, player: IPlayer) => {
    if (game.players.length >= 2) {
        throw new RequestError('Game is full.', httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.symbol === p.symbol)) {
        throw new RequestError('Symbol already taken --> ' + player.symbol, httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.id === p.id)) {
        throw new RequestError('This player already joined. --> ' + player.id, httpStatus.BAD_REQUEST)
    }

    if (player.symbol !== 'X' && player.symbol !== 'O') {
        throw new RequestError('Invalid symbol --> ' + player.symbol, httpStatus.BAD_REQUEST)
    }
}

export const validateGameStart = (game: Game) => {
    if (game.players.length < 2) {
        throw new RequestError('Game is not full.', httpStatus.BAD_REQUEST)
    }

    if (game.status === 'IN_PROGRESS') {
        throw new RequestError('Game already started.', httpStatus.BAD_REQUEST)
    }
}

export const validateMove = (game: Game, move: any) => {
    if (game.status === 'FINISHED' && game.winner !== null) {
        throw new RequestError(`This game has finished - Winner was: ${game.winner}`, httpStatus.BAD_REQUEST)
    }

    if (game.status === 'FINISHED' && game.winner === 'DRAW') {
        throw new RequestError('This game has finished - Draw!', httpStatus.BAD_REQUEST)
    }

    if (game.status === 'FINISHED') {
        throw new RequestError('This game has finished.', httpStatus.BAD_REQUEST)
    }

    if (game.status !== 'IN_PROGRESS' || game.winner !== null) {
        throw new RequestError('Game has not yet started.', httpStatus.BAD_REQUEST)
    }

    if (game.currentPlayer !== move.playerId) {
        throw new RequestError(`It's not ${move.playerId}'s turn!`, httpStatus.BAD_REQUEST)
    }

    if (game.board[move.row][move.column] !== '') {
        throw new RequestError('Invalid move!', httpStatus.BAD_REQUEST)
    }

    if (move.row < 0 || move.row > 2 || move.column < 0 || move.column > 2) {
        throw new RequestError('Move out of bounds, please enter a range between 0 and 2.', httpStatus.BAD_REQUEST)
    }
}