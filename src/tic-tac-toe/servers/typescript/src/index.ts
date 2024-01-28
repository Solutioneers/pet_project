import { sentry } from '@hono/sentry'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import httpStatus from 'http-status'
import GameManager from './models/GameManager'
import { RequestError } from './utility/RequestError'

const app = new Hono()

app.use('*', sentry())
app.use('*', cors())

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

    if (!game) {
        throw new RequestError('Game not found.', httpStatus.NOT_FOUND)
    }

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
    const player = await c.req.json()
    const game = GameManager.getInstance().getGame(gameId)

    console.log('game', game, gameId)

    if (!game) {
        throw new RequestError('Game not found', httpStatus.NOT_FOUND)
    }

    if (game.players.length >= 2) {
        throw new RequestError('Game is full.', httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.symbol === p.symbol)) {
        throw new RequestError('Symbol already taken.', httpStatus.BAD_REQUEST)
    }

    if (game.players.some((p) => player.id === p.id)) {
        throw new RequestError('This player already joined.', httpStatus.BAD_REQUEST)
    }

    game.addPlayer(player)

    return c.json({
        id: game.id,
        players: game.players,
    })
})

// Start a specific game.
app.post('/game/:id/start', (c) => {
    const gameId = c.req.param('id')
    const game = GameManager.getInstance().getGame(gameId)

    if (!game) {
        throw new RequestError('Game not found.', httpStatus.NOT_FOUND)
    }

    if (game.players.length < 2) {
        throw new RequestError('Game is not full.', httpStatus.BAD_REQUEST)
    }

    if (game.status === 'IN_PROGRESS') {
        throw new RequestError('Game already started.', httpStatus.BAD_REQUEST)
    }

    try {
        game.start()
    } catch (err: any) {
        throw new RequestError(err.message, httpStatus.BAD_REQUEST)
    }

    return c.json(game)
})

// Make a move on a specific game.

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
