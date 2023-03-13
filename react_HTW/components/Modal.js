import React from "react";

const Modal = ({ message, onRestart }) => {
	return (
		<div className="modal">
			<div className="modal-content">
				<h2>{message}</h2>
				<button onClick={onRestart}>Restart</button>
			</div>
		</div>
	);
};

export default Modal;
