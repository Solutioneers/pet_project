import { MiddlewareHandler } from 'hono'
import httpStatus from 'http-status'
import GameManager from '../models/GameManager'
import { RequestError } from '../utility/RequestError'

export const gameIdValidator: MiddlewareHandler = async (c, next) => {
    const gameId = c.req.url.split('/').at(-2)
    if (!gameId) {
        throw new RequestError('Invalid game id.', httpStatus.BAD_REQUEST)
    }
    const game = GameManager.getInstance().getGame(gameId)

    if (!game) {
        throw new RequestError('Game not found.', httpStatus.NOT_FOUND)
    }
    await next()
}
