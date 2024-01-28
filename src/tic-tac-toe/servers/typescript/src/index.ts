import { sentry } from '@hono/sentry'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import httpStatus from 'http-status'
import { gameIdValidator } from './middlewares/gameHandler'
import { Game } from './models/Game'
import GameManager from './models/GameManager'
import { RequestError } from './utility/RequestError'
import { validateGameStart, validateJoinGame, validateMove } from './utility/helperFunctions'
import { IMove, IPlayer } from './utility/interfaces'

const app = new Hono()

app.use('*', sentry())
app.use('*', cors())
app.use('/game/:id/*', gameIdValidator)

app.get('/', (c) => {
    return c.text('Welcome Solutioneers!')
})

// Create a new game.
app.post('/game', (c) => {
    const games = GameManager.getInstance()
    const game = games.createGame()

    return c.json({
        id: game.id,
    })
})

// Get a game by id.
app.get('/game/:id', (c) => {
    const gameId = c.req.param('id')
    const game = GameManager.getInstance().getGame(gameId)

    return c.json(game)
})

// Get all games.
app.get('/games', (c) => {
    const games = GameManager.getInstance().listAllGames()
    return c.json(games)
})

// Add a player to a specific game.
app.post('/game/:id/join', async (c) => {
    const gameId = c.req.param('id')
    const player = (await c.req.json()) as IPlayer
    const game = GameManager.getInstance().getGame(gameId)

    if (!game) {
        throw new RequestError('Game not found', httpStatus.NOT_FOUND)
    }

    validateJoinGame(game, player)

    game.addPlayer(player)

    return c.json({
        id: game.id,
        players: game.players,
    })
})

// Start a specific game.
app.post('/game/:id/start', (c) => {
    const gameId = c.req.param('id')
    const game = GameManager.getInstance().getGame(gameId) as Game

    validateGameStart(game)

    try {
        game.start()
    } catch (err: any) {
        throw new RequestError(err.message, httpStatus.BAD_REQUEST)
    }

    return c.json(game)
})

// Make a move on a specific game.
app.post('/game/:id/move', async (c) => {
    const gameId = c.req.param('id')
    const move = (await c.req.json()) as IMove
    const game = GameManager.getInstance().getGame(gameId) as Game

    validateMove(game, move)

    try {
        game.makeMove(move.playerId, move.row, move.column)
        game.checkForWinner()

        return c.json(game)
    } catch (err: any) {
        throw new RequestError(err.message, httpStatus.BAD_REQUEST)
    }
})

app.notFound(() => {
    throw new RequestError('Not Found.', httpStatus.NOT_FOUND)
})

app.onError((err, c) => {
    if (err instanceof RequestError) {
        return c.json(
            {
                error: {
                    message: err.message,
                    status: err.statusCode,
                },
            },
            err.statusCode,
        )
    }
    return c.json({ error: err.message, status: httpStatus.INTERNAL_SERVER_ERROR }, httpStatus.INTERNAL_SERVER_ERROR)
})

export default app
