import React from 'react';
import Auth from './Layout';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Input } from '../../components/form.js';
import axios from 'axios';

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// Form Data
			firstName: '',
			lastName: '',
			phone: '',
			dateOfBirth: '2002-01-01',
			email: '',
			password: '',

			// Pre-compiled Data
			dobYear: '2002',
			dobMonth: '01',
			dobDate: '01',

			// Form Errors
			firstNameError: null,
			lastNameError: null,
			phoneError: null,
			dateOfBirthError: null,
			emailError: null,
			passwordError: null,

			// Form Status
			loading: false,
			loggedIn: false,
		}

		this.register = this.register.bind(this);
		this.loading = this.loading.bind(this);
		this.saveUser = props.saveUser.bind(this);
	}
	/********************************************************************************************
	*--------------------------------------------
	* Life Cycle
	*--------------------------------------------
	********************************************************************************************/
	componentDidUpdate(prevProps, prevState) {
		if (prevState.firstName !== this.state.firstName) {
			this.setState({firstName: this.state.firstName});
		}

		if (prevState.lastName !== this.state.lastName) {
			this.setState({lastName: this.state.lastName});
		}

		if (prevState.phone !== this.state.phone) {
			this.setState({phone: this.state.phone});
		}

		if (prevState.dobYear !== this.state.dobYear || prevState.dobMonth !== this.state.dobMonth || prevState.dobDate !== this.state.dobDate) {
			this.setState({dateOfBirth: `${this.state.dobYear}-${this.state.dobMonth}-${this.state.dobDate}`});
		}

		if (prevState.email !== this.state.email) {
			this.setState({email: this.state.email});
		}

		if (prevState.password !== this.state.password) {
			this.setState({password: this.state.password});
		}
	}

	/********************************************************************************************
	*--------------------------------------------
	* Mutators
	*--------------------------------------------
	********************************************************************************************/

	loading(status) {
		this.setState({
			loading: status
		});
	}

	async register(event) {
		event.preventDefault();

		this.setState({
			firstNameError: null,
			lastNameError: null,
			phoneError: null,
			dateOfBirthError: null,
			emailError: null,
			passwordError: null
		});

		this.loading(true);

		axios({
			url: 'http://localhost:1337/api/register',
			method: 'POST',
			data: {
				firstName:this.state.firstName,
				lastName:this.state.lastName,
				phone:this.state.phone,
				dateOfBirth:this.state.dateOfBirth,
				password: this.state.password,
				email: this.state.email,
			}
		})
		.then((response) => {
			this.loading(false);

			if (!response.data.success) {
				// Trigger Error
				return 
			}
			const user = response.data.user;
			const token = response.data.token;
			this.saveUser(user, token);
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

	/********************************************************************************************
	*--------------------------------------------
	* Main Render
	*--------------------------------------------
	********************************************************************************************/
	render () {
		if (this.state.loggedIn) {
			return <Redirect to='/' />
		}

		return (
			<Auth>
				<h3 className="font-weight-bold mb-4">Create your account</h3>
				<p className="font-weight-light mb-5">Fill the form below to continue </p>

				<div className="row">
					<div className="col-md-6 col-xl-5 mx-auto">

						<form className={ this.state.loading ? 'auth-form-loading' : '' } onSubmit={ this.register }>

							<div className="auth-form-group mb-3">
								<div className="row">
									<div className="col-6">
										<Input
											className={`auth-input text-left ${this.state.firstNameError ? 'auth-input-error' : ''}`}
											placeholder="First Name"
											model="firstName"
											state={ this.state } />
									</div>
									<div className="col-6">
										<Input
											className={`auth-input text-left ${this.state.lastNameError ? 'auth-input-error' : ''}`}
											placeholder="Last Name"
											model="lastName"
											state={ this.state } />
									</div>
								</div>

								{(() => {if (this.state.firstNameError) {
									return <div className="auth-form-text text-danger">{ this.state.firstNameError }</div>
								}})()}
								{(() => {if (this.state.lastNameError) {
									return <div className="auth-form-text text-danger">{ this.state.lastNameError }</div>
								}})()}
							</div>

							<div className="auth-form-group mb-3">
								<div className="row">
									<div className="col-4">
										<Input
											className={`auth-input text-left ${this.state.dateOfBirthError ? 'auth-input-error' : ''}`}
											placeholder="Birth Year"
											model="dobYear"
											maxLength="4"
											state={ this.state } />
									</div>
									<div className="col-4">
										<Input
											className={`auth-input text-left ${this.state.dateOfBirthError ? 'auth-input-error' : ''}`}
											placeholder="Birth Month"
											model="dobMonth"
											maxLength="2"
											state={ this.state } />
									</div>
									<div className="col-4">
										<Input
											className={`auth-input text-left ${this.state.dateOfBirthError ? 'auth-input-error' : ''}`}
											placeholder="Birth Date"
											model="dobDate"
											maxLength="2"
											state={ this.state } />
									</div>
								</div>

								{(() => {if (this.state.dateOfBirthError) {
									return <div className="auth-form-text text-danger">{ this.state.dateOfBirthError }</div>
								}})()}
							</div>
							
							<div className="auth-form-group mb-3">
								<Input
									className={`auth-input text-left ${this.state.phoneError ? 'auth-input-error' : ''}`}
									placeholder="Phone"
									model="phone"
									state={ this.state } />

								{(() => {if (this.state.phoneError) {
									return <div className="auth-form-text text-danger">{ this.state.phoneError }</div>
								}})()}
							</div>

							<div className="auth-form-group mb-3">
								<Input
									className={`auth-input text-left ${this.state.emailError ? 'auth-input-error' : ''}`}
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
									className={`auth-input text-left ${this.state.passwordError ? 'auth-input-error' : ''}`}
									placeholder="Password"
									model="password"
									state={ this.state } />

								{(() => {if (this.state.passwordError) {
									return <div className="auth-form-text text-danger">{ this.state.passwordError }</div>
								}})()}
							</div>

							<p>
								Already have an account? <Link to="/login">Login</Link>
							</p>

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
			saveUser: ( user, token ) => dispatch({ type: 'LOGIN', user, token })
		}
	}
)(Register);