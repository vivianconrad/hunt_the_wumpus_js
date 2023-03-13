import React, { useState } from "react";
import Board from "./components/Board";
import Game from "./components/Game";
import Modal from "./components/Modal";
import Player from "./components/Player";
import Room from "./components/Room";
import Status from "./components/Status";

const App = () => {
	const [playerName, setPlayerName] = useState("");
	const [gameOver, setGameOver] = useState(false);
	const [gameWon, setGameWon] = useState(false);

	const handlePlayerNameChange = (event) => {
		setPlayerName(event.target.value);
	};

	return (
		<div className="app">
			{gameOver || gameWon ? (
				<Modal gameOver={gameOver} gameWon={gameWon} />
			) : (
				<div>
					<Game
						playerName={playerName}
						setGameOver={setGameOver}
						setGameWon={setGameWon}
					/>
					<Board>
						{(rooms, playerLocation) =>
							rooms.map((room, index) => (
								<Room key={index} room={room} playerLocation={playerLocation} />
							))
						}
						<Player location={playerLocation} />
					</Board>
					<Status score={0} arrows={3} warnings={null} />
				</div>
			)}
			{gameOver && (
				<div className="game-over">
					<h2>Game Over</h2>
					<p>Your score: 0</p>
				</div>
			)}
		</div>
	);
};

export default App;
