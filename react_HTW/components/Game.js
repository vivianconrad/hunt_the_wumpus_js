import React, { useState } from "react";
import Board from "./Board";
import Status from "./Status";
import Modal from "./Modal";

const Game = () => {
	// Set up the initial game state
	const [playerName, setPlayerName] = useState("");
	const [playerLocation, setPlayerLocation] = useState(0);
	const [wumpusLocation, setWumpusLocation] = useState(0);
	const [rooms, setRooms] = useState([]);
	const [arrowsRemaining, setArrowsRemaining] = useState(5);
	const [gameOver, setGameOver] = useState(false);
	const [gameWon, setGameWon] = useState(false);

	// Set up the handleMove function
	const handleMove = (newLocation) => {
		// Update the player location
		setPlayerLocation(newLocation);

		// Check if the new location has bats, pits, or the Wumpus
		const newRoom = rooms[newLocation];
		if (newRoom.contents.includes("bats")) {
			// Move the player to a random room
			const randomLocation = Math.floor(Math.random() * rooms.length);
			setPlayerLocation(randomLocation);
		} else if (newRoom.contents.includes("pit")) {
			// Game over, player falls into a pit
			setGameOver(true);
		} else if (newLocation === wumpusLocation) {
			// Game over, player encounters the Wumpus
			setGameOver(true);
		} else {
			// Player moved successfully, reduce the arrows remaining
			setArrowsRemaining(arrowsRemaining - 1);
		}
	};

	// Set up the handleShoot function
	const handleShoot = (targetLocation) => {
		// Reduce the arrows remaining
		setArrowsRemaining(arrowsRemaining - 1);

		// Check if the player hit the Wumpus
		if (targetLocation === wumpusLocation) {
			// Game won, player shot the Wumpus
			setGameWon(true);
		} else {
			// Wumpus moves to a random adjacent room
			const adjacentRooms = rooms[playerLocation].adjacent;
			const randomLocation =
				adjacentRooms[Math.floor(Math.random() * adjacentRooms.length)];
			setWumpusLocation(randomLocation);

			// Check if the Wumpus moved into the player's room
			if (randomLocation === playerLocation) {
				// Game over, Wumpus attacks the player
				setGameOver(true);
			}
		}
	};

	// Set up the handleRestart function
	const handleRestart = () => {
		// Reset the game state
		setPlayerName("");
		setPlayerLocation(0);
		setWumpusLocation(0);
		setRooms([]);
		setArrowsRemaining(5);
		setGameOver(false);
		setGameWon(false);
	};

	// Generate the list of rooms
	const generateRooms = () => {
		const newRooms = [];
		for (let i = 0; i < 16; i++) {
			// Define the room object
			const room = {
				id: i,
				contents: [],
				adjacent: [],
			};

			// Add bats to 25% of the rooms
			if (Math.random() < 0.25) {
				room.contents.push("bats");
			}

			// Add pits to 25% of the rooms
			if (Math.random() < 0.25) {
				room.contents.push("pit");
			}

			// Add the room to the list
			newRooms.push(room);
		}

		// Define the room's adjacent rooms
		const adjacentRooms = [];
		if (i % 4 !== 0) {
			adjacentRooms.push(i - 1);
		}
		if (i % 4 !== 3) {
			adjacentRooms.push(i + 1);
		}
		if (i >= 4) {
			adjacentRooms.push(i - 4);
		}
		if (i <= 11) {
			adjacentRooms.push(i + 4);
		}
		room.adjacent = adjacentRooms;

		// Add the Wumpus to one of the rooms
		if (i === 0) {
			setWumpusLocation(i);
		}

		// Add the room to the list
		newRooms.push(room);
	};

	// Set the rooms state
	setRooms(newRooms);
};

// Define the room's adjacent rooms
const adjacentRooms = [];
if (i % 4 !== 0) {
	adjacentRooms.push(i - 1);
}
if (i % 4 !== 3) {
	adjacentRooms.push(i + 1);
}
if (i >= 4) {
	adjacentRooms.push(i - 4);
}
if (i <= 11) {
	adjacentRooms.push(i + 4);
}
room.adjacent = adjacentRooms;

// Add the Wumpus to one of the rooms
if (i === 0) {
	setWumpusLocation(i);
}

// Add the room to the list
newRooms.push(room);

// Set the rooms state
setRooms(newRooms);

// Generate the rooms on mount
useEffect(() => {
	generateRooms();
}, []);

// Render the game components
return (
	<div className="game">
		<h1>Hunt the Wumpus</h1>
		{gameOver || gameWon ? (
			<Modal
				message={gameOver ? "Game over!" : "You win!"}
				onRestart={handleRestart}
			/>
		) : (
			<>
				<Status
					playerName={playerName}
					score={
						playerLocation === wumpusLocation
							? 0
							: 100 - (5 - arrowsRemaining) * 10
					}
					arrowsRemaining={arrowsRemaining}
				/>
				<Board
					playerLocation={playerLocation}
					wumpusLocation={wumpusLocation}
					rooms={rooms}
					onMove={handleMove}
					onShoot={handleShoot}
				/>
			</>
		)}
	</div>
);

export default Game;
