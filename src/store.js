import { createStore } from "redux";

const initialState = {
	// posts: [
	// 	{
	// 		id: 1,
	// 		user_id: 1,
	// 		title: "To provide or to reject the blind are welcome option to find",
	// 		body: "And it takes nsuscipit follow accepted lightly with nreprehenderit discomfort may be the entire nnostrum of the things that happens is that they are extremely",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: false,
	// 			commented: false,
	// 			likes: 0,
	// 		},
	// 		comments: [
	// 			{
	// 				id: 1,
	// 				user_id: 1,
	// 				post_id: 1,
	// 				text: 'This is a comment to a post',
	// 				author: 'Antonio Chimezie Okoro',
	// 				date: new Date(),
	// 				meta: {
	// 					liked: false,
	// 					commented: false,
	// 					likes: 0,
	// 				},
	// 				replies: []
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 2,
	// 		user_id: 1,
	// 		title: "That was",
	// 		body: "Is existed at the time of life 'Blessed are the pain of her pains, nor condemn nseq they are nothing nfugiat or not at all the blandishments of pleasure, and the discomfort may rejecting some nWho, not being due, we may be able to open the man who did not, but there is no",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: false,
	// 			commented: false,
	// 			likes: 0,
	// 		},
	// 		comments: []
	// 	},
	// 	{
	// 		id: 3,
	// 		user_id: 1,
	// 		title: "Those who reject the troubles they exercise that is either",
	// 		body: "And on the right, but nvoluptatis blinded to the election or nvoluptatis pains or denouncing any resultant nmolestiae on his work and wants to hate or",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: true,
	// 			commented: true,
	// 			likes: 5,
	// 		},
	// 		comments: []
	// 	},
	// 	{
	// 		id: 4,
	// 		user_id: 1,
	// 		title: "It will be blinded",
	// 		body: "Rejects any and often experience pleasure mānsit lot of things to take to provide fault nquir here the opportunity to do the right bound pain nFor the pleasure of the outdoor",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: false,
	// 			commented: false,
	// 			likes: 75,
	// 		},
	// 		comments: []
	// 	},
	// 	{
	// 		id: 5,
	// 		user_id: 1,
	// 		title: "Do you hate",
	// 		body: "I look for things, but rejected nal or to avoid it, but it is nvoluptatis all the pleasures of what we can nest bound or no pain",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: true,
	// 			commented: true,
	// 			likes: 75,
	// 		},
	// 		comments: []
	// 	},
	// 	{
	// 		id: 6,
	// 		user_id: 1,
	// 		title: "Great pain to open for them",
	// 		body: "In order to follow the rejects of the body, provide in any one of these there is nothing nmollitia us dare to give annoyance nperspiciatis of denouncing, and the things which I condemn no one from the nvoluptatis The sorrows of pain and discomfort he wishes to",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: false,
	// 			commented: false,
	// 			likes: 75,
	// 		},
	// 		comments: []
	// 	},
	// 	{
	// 		id: 7,
	// 		user_id: 1,
	// 		title: "Large and easy",
	// 		body: "Let it be shown some of the pain of life, please in which a man who has no one, either, for who is often nmagni nQuidam repel excepturi that, because I nsunt do who comes after them, but the things which they call",
	// 		tags: ['philosophy', 'tag'],
	// 		author: 'Antonio Chimezie Okoro',
	// 		date: new Date(),
	// 		meta: {
	// 			liked: false,
	// 			commented: false,
	// 			likes: 75,
	// 		},
	// 		comments: []
	// 	},
	// ],
	posts: [],
	user: null,
	loggedIn: false,
	token: null,
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
	POST_COMMENT(state, action) {
		var posts = state.posts.slice();
		posts.map(post => {
			if (post.id === action.post_id) {
				var comments = post.comments.slice();
				const comment = {
					id: post.comments.length + 1,
					user_id: 1,
					post_id: post.id,
					text: action.comment,
					author: 'Antonio Chimezie Okoro',
					date: new Date(),
					meta: {
						liked: false,
						commented: false,
						likes: 0,
					},
					replies: [],
					isNew: true
				};
				comments.push(comment);
				post.comments = comments;
				return post;
			}else {
				return post;
			}
		});
		return {
			...state,
			posts
		};
	},
	LIKE_POST(state, action) {
		var posts = state.posts.slice();
		posts.map(post => {
			if (post.id === action.post_id) {
				post.meta.liked = true;
				post.meta.likes += 1;
				return {
					...post,
					meta: {
						liked: true,
						likes: 1
					}
				};
			}else {
				return post;
			}
		});
		return {
			...state,
			posts
		};
	},
	DISLIKE_POST(state, action) {
		var posts = state.posts.slice();
		posts.map(post => {
			if (post.id === action.post_id) {
				post.meta.liked = false;
				post.meta.likes -= 1;
				return {
					...post,
					meta: {
						liked: false,
						likes: 0
					}
				};
			}else {
				return post;
			}
		});
		return {
			...state,
			posts
		};
	},
	LOGIN(state, action) {
		const token = action.user.appToken;

		localStorage.setItem('eblog-app-token', token);

		return {
			...state,
			loggedIn: true,
			user: action.user,
			token
		}
	},
	LOGOUT(state, action) {

		// localStorage.removeItem('eblog-app-token');

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