import React from "react";

const Player = ({ location }) => {
	return (
		<div className="player">
			<div className="player-icon" style={{ gridArea: `${location + 1}` }}>
				<span role="img" aria-label="player">
					🤠
				</span>
			</div>
		</div>
	);
};

export default Player;
