import React from "react";
import Room from "./Room";
import Player from "./Player";

const Board = (props) => {
	const { rooms, playerLocation } = props;

	// Define the grid styles
	const gridStyles = {
		display: "grid",
		gridTemplateColumns: "repeat(4, 1fr)",
		gridTemplateRows: "repeat(4, 1fr)",
		gap: "10px",
	};

	// Map through the rooms and render each one
	const roomList = rooms.map((room) => <Room key={room.id} room={room} />);

	return (
		<div style={gridStyles}>
			{roomList}
			<Player location={playerLocation} />
		</div>
	);
};

export default Board;
