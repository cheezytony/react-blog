import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../../routes.js';
import Navbar from './Navbar.js';

class Blog extends React.Component {

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

			</div>
		);
	}
}

export default Blog;