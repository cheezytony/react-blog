import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function renderAuthLink(props) {
	if (props.loggedIn) {
		return (
			<li className="nav-item dropdown">
				<a href="/" className="nav-link" data-toggle="dropdown">
					<span className="navbar-user-avatar">
						<span className="ion-ios-person"></span>
					</span>
				</a>
				<ul className="dropdown-menu">
					<Link to="/post/new" className="dropdown-item">New Post</Link>
					<Link to={`/user/${props.user.id}`} className="dropdown-item">My Profile</Link>
					<a
						href="/"
						className="dropdown-item"
						onClick={ (event) => { event.preventDefault(); props.logout() } }>
							Logout
						</a>
				</ul>
			</li>
		);
	}else {
		return (
			<li className="nav-item">
				<Link to="/login" className="btn btn-outline-primary">Login</Link>
			</li>
		);
	}
}

function Navbar(props) {
	return (
		<nav className="navbar navbar-expand-md">
			<div className="container navbar-container">

				<Link to="/" className="navbar-brand">e blog</Link>

				<div className="navbar-collapse">
					<ul className="nav navbar-nav ml-auto">
						<li className="nav-item">
							<Link to="/search" className="nav-link">Search</Link>
						</li>
						{ renderAuthLink(props) }
					</ul>
				</div>

			</div>
		</nav>
	);
}

export default connect(
	state => ({
		loggedIn: state.loggedIn,
		user: state.user,
	}),
	dispatch => ({
		logout: () => dispatch({ type: 'LOGOUT' })
	})
)(Navbar);