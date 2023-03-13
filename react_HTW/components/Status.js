import React from "react";

const Status = ({ score, arrows, warnings }) => {
	return (
		<div className="status">
			<div className="status-item">
				<span>Score:</span>
				<span>{score}</span>
			</div>
			<div className="status-item">
				<span>Arrows:</span>
				<span>{arrows}</span>
			</div>
			{warnings && (
				<div className="status-item">
					<span>Warnings:</span>
					<span>{warnings}</span>
				</div>
			)}
		</div>
	);
};

export default Status;
