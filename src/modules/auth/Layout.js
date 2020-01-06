import React from 'react';
import Pages from '../../assets/jpg/pages.jpg';

export default (props) => (
	<div>
		<img src={ Pages } alt="background" className="auth-bg"/>
		<div className="auth-container">
			<div className="container">
				<div className="w-100">
					<div className="row">
						<div className="col-md-10 col-md-8 mx-auto">
							<div className="card auth-card">
								<div className="card-body">
									{ props.children }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);