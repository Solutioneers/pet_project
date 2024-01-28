# Tic-Tac-Toe Game Backend

This project is a backend service for a Tic-Tac-Toe game, written in TypeScript and utilizing the Hono framework for creating serverless functions. The service is designed to manage game state and player interactions for games of Tic-Tac-Toe, making it possible for various frontends to interface with it to facilitate multiplayer gameplay.

## Features (So far)

- Create new game instances
- Join existing games
- Check game state and winner
- List all games

## TODO

- Make moves within a game - Logic is there, but there is no endpoint to make moves right now.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v14 or higher)
- npm or pnpm

### Installation

Highly suggested that you get pnpm if you don't have it through here -> https://pnpm.io/installation

It's an npm alternative, it caches packages you download so you don't have to install them every time.

1. Install dependencies:
```
pnpm i
```
2. Run the project
```
pnpm dev
```

If you don't like to get `pnpm` you can use npm instead.
```
npm i

npm run dev
```

And now when you go over to `http://localhost:8787/` you should see a "Welcome Solutioneers!" page.

## API Endpoints

### Create a Game

- **Endpoint**: `POST /game`
- **Method**: `POST`
- **Description**: Creates a new game and returns the game ID.
- **Response Example**:
  ```json
  {
    "id": "gameId",
  }
  ```

### Join a Game

- **Endpoint**: `POST /game/:id/join`
- **Method**: `POST`
- **Description**: Adds a player to a specific game by ID. The player information should be included in the request body.
- **Request Example**:
  ```
  {
    "id": "player1Id",
    "symbol": "X" | "O" // Letter O, not number zero.
  }
  ```
- **Response Example**:
  ```json
  {
    "id": "gameId",
    "players": [
      { "id": "player1Id", "symbol": "X" },
      { "id": "player2Id", "symbol": "O" }
    ],
  }
  ```

### Start a Game

- **Endpoint**: `POST /game/:id/start`
- **Method**: `POST`
- **Description**: Starts a specific game and returns the game state.
- **Response Example**:
  ```
   {
     "id": "gameId",
     // Additional game state information...
     "status": "IN_PROGRESS"
   }
  ```

### Get Game State

- **Endpoint**: `GET /game/:id`
- **Method**: `GET`
- **Description**: Retrieves the current state of a specified game.
- **Response Example**:
  ```
  {
    "id": "gameId",
    "board": [
      ["X", "O", ""],
      ["", "X", ""],
      ["", "", "O"]
    ],
    "players": [
      { "id": "player1Id", "symbol": "X" },
      { "id": "player2Id", "symbol": "O" }
    ],
    "currentPlayer": "",
    "status": "WAITING" | "IN_PROGRESS" | "FINISHED" ,
    "winner": string | null
  }
  ```

### List All Games

- **Endpoint**: `GET /games`
- **Method**: `GET`
- **Description**: Lists all ongoing and completed games.
- **Response Example**:
  ```
  [
    {
      "id": "game1Id",
      // Additional game state information...
    },
    {
      "id": "game2Id",
      // Additional game state information...
    }
  ]
  ```

## Error Handling

Errors are returned in the following format:

```
{
  "error": {
    "message": string,
    "status": number
  }
}
```

Proper status codes are used to signify the nature of the error.

## Development

To contribute to the project:

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-new-feature
   ```
2. Make your changes and commit them:
   ```bash
   git commit -am 'Add some feature'
   ```
3. Push to the branch:
   ```bash
   git push origin feature/your-new-feature
   ```
4. Create a new Pull Request.

## Testing

To run tests:

```bash
npm test
```

Ensure you write tests for any new features or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
