import { createStore } from "redux";
import cookie from "./helpers/cookies";

const initialState = {
	/*
	------------------------------------------------------
	| POSTS
	------------------------------------------------------
	*/
	posts: [],

	/*
	------------------------------------------------------
	| SESSION
	------------------------------------------------------
	*/
	user: null,
	loggedIn: false,
	token: null,

	/*
	------------------------------------------------------
	| CONFIG
	------------------------------------------------------
	*/
	location: 'cookies',
	session_timeout: 60 * 10,

	/*
	------------------------------------------------------
	| STATUS
	------------------------------------------------------
	*/
	ready: false
};

const actions = {
	ADD_POSTS(state, action) {
		// var posts = state.posts.slice();
		// posts.concat(action.posts);

		return {
			...state,
			posts: [
				...state.posts,
				...action.posts
			]
		}
	},
	LOGIN(state, action) {
		const token = action.token;

		switch (state.location) {
			case 'local-storage':
				localStorage.setItem('eblog-app-token', token);
				break;
			case 'cookies':
			default:
				cookie.set('eblog-app-token', token);
				break;
		}

		return {
			...state,
			loggedIn: true,
			user: action.user,
			token
		}
	},
	LOGOUT(state, action) {

		switch (state.location) {
			case 'local-storage':
				localStorage.removeItem('eblog-app-token');
				break;
			case 'cookies':
			default:
				cookie.remove('eblog-app-token');
				break;
		}

		return {
			...state,
			loggedIn: false,
			user: null,
			token: null
		}
	},
	READY(state, action) {
		const newState = { ...state, ready: true };
		return newState;
	},
	NOT_READY(state, action) {
		const newState = { ...state, ready: false };
		return newState;
	}
}

const reducer = (state = initialState, action) => {
	if (actions[action.type]) {
		return actions[action.type](state, action);
	}

	return state;
}

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());