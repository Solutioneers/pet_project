import httpStatus from 'http-status'
import { Game } from '../models/Game'
import { RequestError } from './RequestError'
import { IPlayer } from './interfaces'

/**
 * Validates the request to join a game.
 * @param game
 * @param player
 */
export const validateJoinGame = (game: Game, player: IPlayer) => {
    if (game.players.length >= 2) {
        throw new RequestError('Game is full.', httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.symbol === p.symbol)) {
        throw new RequestError('Symbol already taken.', httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.id === p.id)) {
        throw new RequestError('This player already joined.', httpStatus.BAD_REQUEST)
    }

    if (player.symbol !== 'X' && player.symbol !== 'O') {
        throw new RequestError('Invalid symbol.', httpStatus.BAD_REQUEST)
    }
}

/**
 * Validates the request to start a game.
 * @param game
 */
export const validateGameStart = (game: Game) => {
    if (game.players.length < 2) {
        throw new RequestError('Game is not full.', httpStatus.BAD_REQUEST)
    }

    if (game.status === 'IN_PROGRESS') {
        throw new RequestError('Game already started.', httpStatus.BAD_REQUEST)
    }
}
