import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from "react-redux";
import routes from '../../routes.js';
import Navbar from './Navbar.js';
import Modal from '../../components/Modal.js';
import Waiting from '../../assets/svg/Waiting.js';
import $ from 'jquery';

class Blog extends React.Component {

	/********************************************************************************************
	*--------------------------------------------
	* Life Cycle
	*--------------------------------------------
	********************************************************************************************/
	componentDidMount() {
		$('#modal').modal('show');
	}

	componentWillUnmount() {
		$('#modal').modal('hide');
	}

	/********************************************************************************************
	*--------------------------------------------
	* Sub Components
	*--------------------------------------------
	********************************************************************************************/
	renderLoginPrompt() {
		if (!this.props.loggedIn) {
			var buttons = (
				<div className="flex-full d-flex flex-column align-items-center">
					<button className="btn text-muted mb-2" data-dismiss="modal">Maybe Later</button>
					<Link to="/register" className="btn btn-primary">Create My Account</Link>
				</div>
			);

			return (
				<Modal footer={ buttons } id="modal">
					<div className="text-center pt-5">
						<div className="row">
							<div className="col-md-8 mx-auto">
								<h4 className="heading">We noticed you're not logged in</h4>
								<p className="text-muted small">Create your own account so you can post, like posts, comment on posts and more.</p>
								<Waiting height="280" />
							</div>
						</div>
					</div>
				</Modal>
			);
		}
	}

	renderNewsletter() {

	}

	renderFooter() {

	}

	render() {
		return (
			<div className="blog">

				<Navbar />

				<div className="container blog-container">
					<Switch>
						{ routes.blog.map((route, i) => 
							<Route { ...route } key={ i } />
						) }
					</Switch>
				</div>

				{ this.renderNewsletter() }

				{ this.renderFooter() }

				{ this.renderLoginPrompt() }

			</div>
		);
	}
}

export default connect(
	state => ({
		loggedIn: state.loggedIn
	})
)(Blog);