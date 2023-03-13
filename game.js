// Game constants
const NUM_ROOMS = 20;
const NUM_PITS = 3;
const NUM_BATS = 3;
const WUMPUS_ROOM = getRandomRoom();
const PIT_ROOMS = getRandomRooms(NUM_PITS, [WUMPUS_ROOM]);
const BAT_ROOMS = getRandomRooms(NUM_BATS, [WUMPUS_ROOM, ...PIT_ROOMS]);

// Set up the game
const cave = {
	rooms: [],
	player: null,
	wumpus: null,
	pits: [],
	bats: [],
};

// Room object
function Room(id) {
	this.id = id;
	this.connectedRooms = [];
	this.isPit = false;
	this.hasBats = false;
	this.hasWumpus = false;
	this.hasPlayer = false;
}

// Create rooms
for (let i = 0; i < NUM_ROOMS; i++) {
	cave.rooms.push(new Room(i));
}

// Player object
function Player() {
	this.currentRoom = null;
	this.arrows = 5;
}

// Set player's starting position
cave.player = new Player();
cave.player.currentRoom = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
cave.player.currentRoom.hasPlayer = true;

// Place Wumpus
cave.wumpus = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
cave.wumpus.hasWumpus = true;

// Place pits
for (let i = 0; i < NUM_PITS; i++) {
	let pitRoom = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
	while (
		pitRoom.isPit ||
		pitRoom.hasWumpus ||
		pitRoom.hasBats ||
		pitRoom.hasPlayer
	) {
		pitRoom = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
	}
	pitRoom.isPit = true;
	cave.pits.push(pitRoom);
}

// Place bats
for (let i = 0; i < NUM_BATS; i++) {
	let batsRoom = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
	while (
		batsRoom.isPit ||
		batsRoom.hasWumpus ||
		batsRoom.hasBats ||
		batsRoom.hasPlayer
	) {
		batsRoom = cave.rooms[Math.floor(Math.random() * NUM_ROOMS)];
	}
	batsRoom.hasBats = true;
	cave.bats.push(batsRoom);
}

// Helper functions
function getRandomRoom() {
	return Math.floor(Math.random() * NUM_ROOMS) + 1;
}

function getRandomRooms(num, exclude = []) {
	const rooms = new Set(exclude);
	while (rooms.size < num + exclude.length) {
		rooms.add(getRandomRoom());
	}
	return Array.from(rooms);
}

const board = createBoard(5, 5);

// Place the player and wumpus randomly on the board
let playerPosition = placeRandomly(board);
let wumpusPosition = placeRandomly(board);

// Place the pits and bats randomly on the board
placeRandomly(board, "P", 3);
placeRandomly(board, "B", 2);

// Keep track of the player's arrows
let arrows = 5;

// Loop until the game is over
let gameOver = false;
while (!gameOver) {
	// Print the board and player positions
	printBoard(board, playerPosition, wumpusPosition);

	// Get the player's move
	let move = prompt("Enter your move (shoot or move):");

	// Handle the player's move
	if (move === "shoot") {
		// Get the room the arrow was shot into
		let shotRoom = getShotRoom(board, playerPosition, wumpusPosition);
		// Decrement the number of arrows
		arrows--;

		// Check if the arrow hit the wumpus
		if (shotRoom === wumpusPosition) {
			alert("You killed the wumpus! You win!");
			gameOver = true;
		} else {
			alert("You missed the wumpus! It's moved to a new room.");
			wumpusPosition = moveRandomly(board, wumpusPosition);
		}
	} else if (move === "move") {
		// Get the player's desired move direction
		let direction = prompt("Enter a direction (up, down, left, or right):");
		// Move the player
		let newPosition = movePlayer(board, playerPosition, direction);

		// Check if the player hit a pit or the wumpus
		if (board[newPosition.row][newPosition.col] === "P") {
			alert("You fell into a pit! Game over!");
			gameOver = true;
		} else if (
			newPosition.row === wumpusPosition.row &&
			newPosition.col === wumpusPosition.col
		) {
			alert("You walked into the wumpus! Game over!");
			gameOver = true;
		} else {
			// Update the player's position
			board[playerPosition.row][playerPosition.col] = ".";
			board[newPosition.row][newPosition.col] = "P";
			playerPosition = newPosition;

			// Move the wumpus
			wumpusPosition = moveRandomly(board, wumpusPosition);

			// Check if the player hit a bat
			if (board[newPosition.row][newPosition.col] === "B") {
				alert("You were picked up by a bat and moved to a new room.");
				playerPosition = placeRandomly(board);
			}

			// Decrement the number of arrows
			arrows--;

			// Check if the player ran out of arrows
			if (arrows === 0) {
				alert("You ran out of arrows! Game over!");
				gameOver = true;
			}
		}
	}
}
