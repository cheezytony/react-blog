const routes = {
	blog: [
		{
			path: '/post/new',
			component: require('./modules/blog/New.js').default
		},
		{
			path: '/:post_id',
			exact: true,
			component: require('./modules/blog/Post.js').default
		},
		{
			path: '/',
			exact: true,
			component: require('./modules/blog/List.js').default
		},
	],
	main: [
		{
			path: '/search',
			// component: require('./modules/auth/Login.js').default
		},
		{
			path: '/login',
			component: require('./modules/auth/Login.js').default
		},
		{
			path: '/',
			component: require('./modules/blog/index.js').default
		},
	]
}

export default routes;