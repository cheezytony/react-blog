import React from "react";

function Modal(props) {
	return (
		<div className="modal fade" { ...props }>
			<div className="modal-dialog modal-lg modal-dialog-centered">
				<div className="modal-content">
					{ (() => props.title && (
						<div className="modal-header">
							{ props.title }
						</div>
					))()}
					<div className="modal-body">
						{ props.children }
					</div>
					{ (() => props.footer && (
						<div className="modal-footer">
							{ props.footer }
						</div>
					))()}
				</div>
			</div>
		</div>
	);
}

export default Modal;