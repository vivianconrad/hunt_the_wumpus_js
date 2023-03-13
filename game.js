// Game constants
const NUM_ROOMS = 20;
const NUM_PITS = 3;
const NUM_BATS = 3;
const WUMPUS_ROOM = getRandomRoom();
const PIT_ROOMS = getRandomRooms(NUM_PITS);
const BAT_ROOMS = getRandomRooms(NUM_BATS);

// Player state
let currentRoom = getRandomRoom();
let arrows = 5;
let gameOver = false;

// Helper functions
function getRandomRoom() {
  return Math.floor(Math.random() * NUM_ROOMS) + 1;
}

function getRandomRooms(num) {
  let rooms = [];
  while (rooms.length < num) {
    let room = getRandomRoom();
    if (!rooms.includes(room) && room !== WUMPUS_ROOM && room !== currentRoom) {
      rooms.push(room);
    }
  }
  return rooms;
}

function getAdjacentRooms(room) {
  let adjacents = [];
  if (room === 1) {
    adjacents.push(2, 5, 8);
  } else if (room === 2) {
    adjacents.push(1, 3, 10);
  } else if (room === 3) {
    adjacents.push(2, 4, 12);
  } else if (room === 4) {
    adjacents.push(3, 5, 14);
  } else if (room === 5) {
    adjacents.push(1, 4, 6);
  } else if (room === 6) {
    adjacents.push(5, 7, 15);
  } else if (room === 7) {
    adjacents.push(6, 8, 17);
  } else if (room === 8) {
    adjacents.push(1, 7, 11);
  } else if (room === 9) {
    adjacents.push(10, 12, 18);
  } else if (room === 10) {
    adjacents.push(2, 9, 11);
  } else if (room === 11) {
    adjacents.push(8, 10, 20);
  } else if (room === 12) {
    adjacents.push(3, 9, 13);
  } else if (room === 13) {
    adjacents.push(12, 14, 19);
  } else if (room === 14) {
    adjacents.push(4, 13, 15);
  } else if (room === 15) {
    adjacents.push(6, 14, 16);
  } else if (room === 16) {
    adjacents.push(15, 17, 19);
  } else if (room === 17) {
    adjacents.push(7, 16, 18);
  } else if (room === 18) {
    adjacents.push(9, 17, 20);
  } else if (room === 19) {
    adjacents.push(13, 16, 20);
  } else if (room === 20) {
    adjacents.push(11, 18, 19);
  }
  return adjacents;
}

function isAdjacent(room1, room2) {
  return getAdjacentRooms(room1).includes(room2);
}

function updateGame() {
  let message = '';

  // Check for hazards
  if (PIT_ROOMS.includes(currentRoom)) {
    message += 'You fell into a pit!\n';
gameOver = true;
} else if (BAT_ROOMS.includes(currentRoom)) {
message += 'You were carried away by bats!\n';
currentRoom = getRandomRoom();
}

// Check for Wumpus
if (isAdjacent(currentRoom, WUMPUS_ROOM)) {
message += 'You smell a Wumpus nearby!\n';
} else if (currentRoom === WUMPUS_ROOM) {
message += 'You were eaten by the Wumpus!\n';
gameOver = true;
}

// Update message if no hazards or Wumpus
if (!message) {
message += 'You are in room ' + currentRoom + '\n';
}

// Check for arrows
if (arrows > 0) {
message += 'You have ' + arrows + ' arrows left.\n';
} else {
message += 'You are out of arrows!\n';
}

// Print message to console
console.log(message);

// Check for game over
if (gameOver) {
console.log('Game over!');
}
}

// Play the game
console.log('Welcome to Hunt the Wumpus!');

while (!gameOver) {
updateGame();

// Get user input
let input = prompt('Enter a room to move to (1-' + NUM_ROOMS + ') or "shoot" to fire an arrow:');

// Process user input
if (input === 'shoot') {
if (arrows > 0) {
arrows--;
let target = prompt('Enter a room to shoot at:');
if (target == WUMPUS_ROOM) {
console.log('You killed the Wumpus! Congratulations!');
gameOver = true;
} else {
console.log('You missed!');
// Move the Wumpus
let newRoom = getRandomRoom();
while (newRoom === currentRoom || newRoom === WUMPUS_ROOM) {
newRoom = getRandomRoom();
}
WUMPUS_ROOM = newRoom;
updateGame();
}
} else {
console.log('You are out of arrows!');
}
} else {
let newRoom = parseInt(input);
if (newRoom >= 1 && newRoom <= NUM_ROOMS && isAdjacent(currentRoom, newRoom)) {
currentRoom = newRoom;
} else {
console.log('Invalid move!');
}
}
}
