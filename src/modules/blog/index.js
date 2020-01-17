import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";
import routes from '../../routes.js';
import Navbar from './Navbar.js';
import Modal from "../../components/Modal.js";
// import $ from "jquery";

class Blog extends React.Component {

	componentDidMount() {
		// console.log($('#modal').modal('show'));
	}

	renderLoginPrompt() {
		if (!this.props.loggedIn) {
			var buttons = (
				<div>
					<button className="btn" data-dismiss="modal">Maybe Later</button>
					<button className="btn btn-primary" data-dismiss="modal">Okay</button>
				</div>
			);

			return (
				<Modal title="Create your own account" footer={ buttons } id="modal">
					<p>We noticed you're not logged in</p>
					<p>Create your own account so you can post, like posts, comment on posts and more.</p>
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