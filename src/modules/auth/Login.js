import React from 'react';
import Auth from './Layout';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Input } from '../../components/form.js';
import axios from 'axios';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			email: '',
			password: '',
			emailError: null,
			passwordError: null,
			loading: false
		}
		this.login = this.login.bind(this);
		this.loading = this.loading.bind(this);
		this.saveUser = props.saveUser.bind(this);
	}

	loading(status) {
		this.setState({
			loading: status
		});
	}

	async login(event) {
		event.preventDefault();

		this.setState({
			emailError: null,
			passwordError: null
		});

		this.loading(true);

		axios({
			url: 'http://localhost:1337/api/login',
			method: 'POST',
			data: {
				email: this.state.email,
				password: this.state.password
			}
		})
		.then((response) => {
			this.loading(false);

			if (!response.data.success) {
				// Trigger Error
				return 
			}
			const user = response.data.user;
			this.saveUser(user);
			this.setState({
				loggedIn: true
			})

		})
		.catch((error) => {
			this.loading(false);

			if (error.response) {
				if (error.response.status === 409 || error.response.status === 422) {
					this.setState({
						emailError: error.response?.data?.errors?.email,
						passwordError: error.response?.data?.errors?.password
					});
				}
			}
		});
	}

	render () {
		if (this.state.loggedIn) {
			return <Redirect to='/' />
		}

		return (
			<Auth>
				<h3 className="font-weight-bold mb-4">Login to your account</h3>
				<p className="font-weight-light mb-5">Enter your email and password to login </p>

				<div className="row">
					<div className="col-md-6 col-xl-5 mx-auto">

						<form className={ this.state.loading ? 'auth-form-loading' : '' } onSubmit={ this.login }>

							<div className="auth-form-group mb-4">
								<Input
									className={`auth-input ${this.state.emailError ? 'auth-input-error' : ''}`}
									placeholder="Email Address"
									model="email"
									state={ this.state } />

								{(() => {if (this.state.emailError) {
									return <div className="auth-form-text text-danger">{ this.state.emailError }</div>
								}})()}
							</div>

							<div className="auth-form-group mb-5">
								<Input
									type="password"
									className={`auth-input ${this.state.passwordError ? 'auth-input-error' : ''}`}
									placeholder="Password"
									model="password"
									state={ this.state } />

								{(() => {if (this.state.passwordError) {
									return <div className="auth-form-text text-danger">{ this.state.passwordError }</div>
								}})()}
							</div>

							<div className="auth-form-group">
								<button type="submit" className="btn btn-primary">
									Submit
								</button>
							</div>

						</form>

					</div>
				</div>
			</Auth>
		);
	}
}

export default connect(
	state => ({}),
	dispatch => {
		return {
			saveUser: ( user ) => dispatch({ type: 'LOGIN', user })
		}
	}
)(Login);