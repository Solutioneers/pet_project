
Considerations:
- How to register as a player?
	- Just enter a nickname? Need an endpoint for this
- Aborting / Resigning games
	- Need endpoint
- Protocol selection / feature support (future endeavour)

# Changes from @Res's server
- Error handling: -status, +code, make message optional
- Add `/players/register`
- Modified game state a bit
- Added `/games/:id/resign`


# Principles
- **Flexibility:** The server should be very liberal with the information it returns, to allow clients more freedom in how they implement things. In other words, the clients will have plenty of information about the game state, lobby states, etc. to make decisions with, so they are not boxed into a specific implementation.
- **Compatibility:** When features are added in future, older clients & servers should still be able to work with newer clients & servers


# Flows to support
Flow #1:
- Player register
- List open games
- Choose a game and join
- Play against that player
	- Make a move,
	- Server returns board status, including if there is a winner
	- Wait for your opponent to make a move (polling the server for the game status)
	- Repeat
- Game is ended

Flow #2:
- Player register
- Create a new game
- Wait for another player to join
- Play against the player
- Game is ended

# Future game flows
Flow #3:
- Player register
- Play against a random player
	- Server matches you with someone else also searching for an opponent
- Play against the player
- Game is ended

Flow #4:
- Player register
- Play against a specific player
	- Player #1 enters the players nickname and they get an invite
	- Player #2 polls the server for invites, receives it, and accepts
	- Server creates game between those specific players
- Play against the player
- Game is ended

# Errors

Errors are returned in the following format:

```ts
{
  "error": {
    "code": string,
    "message": string?
  }
}
```

# Endpoints

## Player - Register

#### Endpoint
```http
POST /players/register
```

#### Request
```json
{
	"nickname": string
}
```

#### Response
```json
{
	"id": string,
	"nickname": string
}
```

#### Error Codes

**`NICKNAME_TAKEN`**
Nickname is already in use by another player
## Game - Start New

#### Endpoint
```http
POST /games/new
```

#### Request
```json
{
	"player_id": string
}
```

#### Response
[Game state](#Objects#GameState)

#### Error Codes

**`PLAYER_NOT_FOUND`**
Player ID not found
## Game - List Open Games

#### Endpoint
```http
GET /games/open
```
#### Response
```
{
	"games": [
		GameState,
		GameState,
	]
}
```

## Game - Join

#### Endpoint
```http
POST /games/:id/join
```

#### Request
```json
{
	"player_id": string
}
```

#### Response
[Game state](#Objects#GameState)

#### Error Codes

**`GAME_NOT_FOUND`**
Game id was not found

**`PLAYER_NOT_FOUND`**
Player ID not found

**`GAME_FULL`**
Game already has two players

**`GAME_NOT_JOINABLE`**
Game is finished, aborted, or not joinable for some other reason


## Game - Get State

#### Endpoint
```http
GET /games/:id
```
#### Response
[Game state](#Objects#GameState)

#### Error Codes

**`GAME_NOT_FOUND`**
Game id was not found

## Game - Make Move

#### Endpoint
```http
POST /games/:id/move
```

#### Request
```ts
{
	"playerId": "somePlayerId",
	"row": 1, // 0-2
	"column": 2 // 0-2
}
```
#### Response
[Game state](#Objects#GameState)

#### Error Codes

**`GAME_NOT_FOUND`**
Game id was not found

**`PLAYER_NOT_IN_GAME`**
The player is not playing in this game

**`GAME_FINISHED`**
Game is finished

**`INVALID_MOVE`**
Invalid row/column, or this position is already taken
## Game - Resign

Causes the player to resign the game. If a player calls `resign` before any moves are made, the game is **aborted**, rather than resigned.

#### Endpoint
```http
POST /games/:id/resign
```

#### Request
```ts
{
	"playerId": "somePlayerId",
}
```
#### Response
[Game state](#Objects#GameState)

#### Error Codes

**`GAME_NOT_FOUND`**
Game id was not found

**`PLAYER_NOT_IN_GAME`**
The player is not playing in this game

**`GAME_FINISHED`**
Game is finished
# Objects

##### GameState
```ts
{
	"id": "gameId",
	"players": [
		{ 
			"id": "player1Id",
			"symbol": "X"
		},
		{
			"id": "player2Id",
			"symbol": "O"
		}
	],
	"playerToMove": "player1Id",
	"board": [
		["X", "O", ""],
		["", "X", ""],
		["", "", "O"]
    ],
	"status": "WAITING" | "IN_PROGRESS" | "FINISHED",
	"result": "WIN" | "DRAW" | "ABORTED" | null,
	"winner": string | null
}
```

**`status`**
- `WAITING`: Waiting to start the game
- `IN_PROGRESS`: The game is in progress
- `FINISHED`: The game has concluded (`result` and possibly `winner` will be populated

**`result`**
- `WIN`: A player has won, either naturally or because the other player resigned
- `DRAW`: The players drew the game
- `ABORTED`: The game was aborted, either by the server or because one of the players resigned before any moves were made.