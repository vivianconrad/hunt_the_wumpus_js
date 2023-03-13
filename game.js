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

// Player state
let currentRoom = getRandomRoom();
let arrows = 5;
let gameOver = false;

// Connect rooms randomly
for (let i = 0; i < NUM_ROOMS; i++) {
	const room = cave.rooms[i];
	const numConnections = Math.floor(Math.random() * 3) + 2;

	while (room.connectedRooms.length < numConnections) {
		const randomIndex = Math.floor(Math.random() * NUM_ROOMS);
		const randomRoom = cave.rooms[randomIndex];

		if (
			randomRoom.id !== room.id &&
			!room.connectedRooms.includes(randomRoom)
		) {
			room.connectedRooms.push(randomRoom);
			randomRoom.connectedRooms.push(room);
		}
	}
}

// Set player's starting position
cave.player = new Player();
const randomIndex = Math.floor(Math.random() * NUM_ROOMS);
cave.player.currentRoom = cave.rooms[randomIndex];
cave.player.currentRoom.hasPlayer = true;

// Place Wumpus
const wumpusIndex = Math.floor(Math.random() * NUM_ROOMS);
cave.wumpus = cave.rooms[wumpusIndex];
cave.wumpus.hasWumpus = true;

// Place pits
for (let i = 0; i < NUM_PITS; i++) {
	const pitIndex = Math.floor(Math.random() * NUM_ROOMS);
	const pitRoom = cave.rooms[pitIndex];

	if (
		!pitRoom.isPit &&
		!pitRoom.hasWumpus &&
		!pitRoom.hasBats &&
		!pitRoom.hasPlayer
	) {
		pitRoom.isPit = true;
		cave.pits.push(pitRoom);
	} else {
		i--;
	}
}

// Place bats
for (let i = 0; i < NUM_BATS; i++) {
	const batsIndex = Math.floor(Math.random() * NUM_ROOMS);
	const batsRoom = cave.rooms[batsIndex];

	if (
		!batsRoom.isPit &&
		!batsRoom.hasWumpus &&
		!batsRoom.hasBats &&
		!batsRoom.hasPlayer
	) {
		batsRoom.hasBats = true;
		cave.bats.push(batsRoom);
	} else {
		i--;
	}
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

function getAdjacentRooms(room) {
	const adjacents = {
		1: [2, 5, 8],
		2: [1, 3, 10],
		3: [2, 4, 12],
		4: [3, 5, 14],
		5: [1, 4, 6],
		6: [5, 7, 15],
		7: [6, 8, 17],
		8: [1, 7, 11],
		9: [10, 12, 18],
		10: [2, 9, 11],
		11: [8, 10, 20],
		12: [3, 9, 13],
		13: [12, 14, 19],
		14: [4, 13, 15],
		15: [6, 14, 16],
		16: [15, 17, 19],
		17: [7, 16, 18],
		18: [9, 17, 20],
		19: [13, 16, 20],
		20: [11, 18, 19],
	};
	return adjacents[room] || [];
}

function isAdjacent(room1, room2) {
	return getAdjacentRooms(room1).includes(room2);
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
	// Print the board and player status
	console.log("Current board:");
	printBoard(board, playerPosition);
	console.log(`Arrows left: ${arrows}`);

	// Get the player's action
	const action = prompt(
		"What would you like to do? (m)ove, (s)hoot, or (q)uit"
	);

	// Handle the player's action
	switch (action) {
		case "m":
			// Move the player
			const direction = prompt(
				"Which direction? (u)p, (d)own, (l)eft, or (r)ight"
			);
			const newPosition = movePlayer(board, playerPosition, direction);
			if (newPosition === wumpusPosition) {
				// The player has walked into the wumpus!
				console.log("You have been eaten by the wumpus!");
				gameOver = true;
			} else if (board[newPosition[0]][newPosition[1]] === "P") {
				// The player has fallen into a pit!
				console.log("You fell into a pit!");
				gameOver = true;
			} else if (board[newPosition[0]][newPosition[1]] === "B") {
				// The player has encountered bats!
				console.log("You hear the flapping of bat wings...");
				playerPosition = placeRandomly(board);
			} else {
				playerPosition = newPosition;
			}
			break;

		case "s":
			// Shoot an arrow
			const shotDirection = prompt(
				"Which direction? (u)p, (d)own, (l)eft, or (r)ight"
			);
			arrows--;
			const hit = shootArrow(
				board,
				playerPosition,
				shotDirection,
				wumpusPosition
			);
			if (hit) {
				console.log("You hit the wumpus! Congratulations!");
				gameOver = true;
			} else if (arrows === 0) {
				console.log("You have run out of arrows. Game over.");
				gameOver = true;
			}
			break;

		case "q":
			// Quit the game
			console.log("Thanks for playing!");
			gameOver = true;
			break;

		default:
			console.log("Invalid action.");
			break;
	}
}

function updateGame() {
	let message = "";
	while (true) {
		// Print current room and connected rooms
		const currentRoom = cave.player.currentRoom;
		console.log(`You are in room ${currentRoom.id}`);
		console.log(
			`Tunnels lead to rooms ${currentRoom.connectedRooms
				.map((room) => room.id)
				.join(", ")}`
		);

		// Check for hazards
		if (PIT_ROOMS.includes(currentRoom)) {
			message += "You fell into a pit!\n";
			gameOver = true;
		} else if (BAT_ROOMS.includes(currentRoom)) {
			message += "You were carried away by bats!\n";
			currentRoom = getRandomRoom();
		}

		// Check for Wumpus
		if (isAdjacent(currentRoom, WUMPUS_ROOM)) {
			message += "You smell a Wumpus nearby!\n";
		} else if (currentRoom === WUMPUS_ROOM) {
			message += "You were eaten by the Wumpus!\n";
			gameOver = true;
		}

		// Update message if no hazards or Wumpus
		if (!message) {
			message += `You are in room ${currentRoom}\n`;
		}

		// Check for arrows
		if (arrows > 0) {
			message += `You have ${arrows} arrows left.\n`;
		} else {
			message += "You are out of arrows!\n";
		}

		// Print message to console
		console.log(message);

		// Check for game over
		if (gameOver) {
			console.log("Game over!");
		}
	}
}

// Play the game
console.log("Welcome to Hunt the Wumpus!");

while (!gameOver) {
	updateGame();

	// Get user input
	let input = prompt(
		"Enter a room to move to (1-" + NUM_ROOMS + ') or "shoot" to fire an arrow:'
	);

	// Process user input
	if (input === "shoot") {
		if (arrows > 0) {
			arrows--;
			let target = prompt("Enter a room to shoot at:");
			if (target == WUMPUS_ROOM) {
				console.log("You killed the Wumpus! Congratulations!");
				gameOver = true;
			} else {
				console.log("You missed!");
				// Move the Wumpus
				let newRoom = getRandomRoom();
				while (newRoom === currentRoom || newRoom === WUMPUS_ROOM) {
					newRoom = getRandomRoom();
				}
				WUMPUS_ROOM = newRoom;
				updateGame();
			}
		} else {
			console.log("You are out of arrows!");
		}
	} else {
		let newRoom = parseInt(input);
		if (
			newRoom >= 1 &&
			newRoom <= NUM_ROOMS &&
			isAdjacent(currentRoom, newRoom)
		) {
			currentRoom = newRoom;
		} else {
			console.log("Invalid move!");
		}
	}
}
