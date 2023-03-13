import React from "react";

const Room = ({ room, playerLocation }) => {
	const isAdjacent = room.adjacent.includes(playerLocation);

	return (
		<div className={`room ${isAdjacent ? "adjacent" : ""}`}>
			<div className="room-contents">
				{room.contents === "wumpus" ? (
					<span role="img" aria-label="wumpus">
						🐉
					</span>
				) : room.contents === "bat" ? (
					<span role="img" aria-label="bat">
						🦇
					</span>
				) : room.contents === "pit" ? (
					<span role="img" aria-label="pit">
						⛔
					</span>
				) : null}
			</div>
		</div>
	);
};

export default Room;
