import React from "react";

function Modal(props) {
	return (
		<div className="modal fade" { ...props }>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						{ props.title }
					</div>
					<div className="modal-body">
						{ props.children }
					</div>
					<div className="modal-footer">
						{ props.footer }
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;