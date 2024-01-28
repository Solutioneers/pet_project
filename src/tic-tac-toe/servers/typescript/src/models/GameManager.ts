import { Game } from './Game'

class GameManager {
    private static instance: GameManager
    private games: Map<string, Game>

    private constructor() {
        this.games = new Map<string, Game>()
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager()
        }
        return GameManager.instance
    }

    createGame(): Game {
        const game = new Game()
        this.games.set(game.id, game)
        return game
    }

    getGame(gameId: string): Game | undefined {
        return this.games.get(gameId)
    }

    listAllGames(): Game[] {
        return Array.from(this.games.values())
    }
}

export default GameManager
