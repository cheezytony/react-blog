import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from './routes';
import AppLoader from './components/AppLoader';
import axios from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ready: props.ready,
			activateStore: props.activateStore,
			deactivateStore: props.deactivateStore,
			login: props.login,
			error: null
		};

	}

	async loadUserSession() {

		const appToken = localStorage.getItem('eblog-app-token');

		if (!appToken) {
			return this.state.activateStore();
		}

		await axios({
			url: 'http://localhost:1337/api/session',
			method: 'POST',
			data: {
				appToken
			}
		})
		.then(response => {
			if (response && response.data && response.data.success) {
				this.state.login(response.data.user, response.data.token);
			}
		})
		.catch(error => {
			this.setState({
				error
			});
		});
		this.state.activateStore();
	}

	componentDidMount() {
		this.loadUserSession();
	}

	componentDidUpdate() {
		if (this.state.ready !== this.props.ready) {
			this.setState({
				ready: this.props.ready
			});
		}
	}

	render() {
		if (!this.state.ready) {
			return <AppLoader />
		}else {
			return (
				<Switch>
					{ routes.main.map((route, i) => 
						<Route { ...route } key={ i } />
					) }
				</Switch>
			);
		}
	}
}

export default connect(
	state => {
		return { ready: state.ready }
	},
	dispatch => {
		return {
			activateStore: () => dispatch({ type: 'READY' }),
			deactivateStore: () => dispatch({ type: 'NOT_READY' }),
			login: (user, token) => dispatch({ type: 'LOGIN', user, token })
		}
	}
)(App);
