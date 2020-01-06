import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BlogItem from './Item';
import axios from 'axios';

class BlogList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			limit: 3,
			page: 1,
			skip: 0,
			total: 0,
			pages: 1,
			likePost: props.likePost,
			dislikePost: props.dislikePost,
			addPosts: props.addPosts,
			loading: false,
			error: null
		}
		this.dislikePost = this.dislikePost.bind(this);
		this.likePost = this.likePost.bind(this);
		this.next = this.next.bind(this);
		this.prev = this.prev.bind(this);
	}

	/********************************************************************************************
	*--------------------------------------------
	* Life Cycle
	*--------------------------------------------
	********************************************************************************************/

	UNSAFE_componentWillMount() {
		this.fetchPosts();
	}

	/********************************************************************************************
	*--------------------------------------------
	* Event Handlers
	*--------------------------------------------
	********************************************************************************************/

	handleLikeClick(post) {
		if (post.meta.liked) {
			this.state.dislikePost(post);
		}else {
			this.state.likePost(post);
		}
	}

	/********************************************************************************************
	*--------------------------------------------
	* Mutators
	*--------------------------------------------
	********************************************************************************************/

	loading(state) {
		this.setState({
			loading: state
		});
	}

	async fetchPosts() {
		this.loading(true);
		await axios.get('http://localhost:1337/post')
		.then(response => {
			// this.state.addPosts(response.data);
			this.setState({
				...response.data
			})
		})
		.catch(error => {
			this.setState({
				error
			});
		});
		this.loading(false);
	}

	async next(event) {
		event.preventDefault();
		if (this.state.page >= this.state.pages) {
			return false;
		}

		this.loading(true);
		await axios.get(`http://localhost:1337/post?page=${Number(this.state.page) + 1}`)
		.then(response => {
			// this.state.addPosts(response.data);
			this.setState({
				...response.data
			})
		})
		.catch(error => {
			this.setState({
				error
			});
		});
		this.loading(false);
	}

	async prev(event) {
		event.preventDefault();
		if (this.state.page <= 1) {
			return false;
		}
		
		this.loading(true);
		await axios.get(`http://localhost:1337/post?page=${Number(this.state.page) - 1}`)
		.then(response => {
			// this.state.addPosts(response.data);
			this.setState({
				...response.data
			})
		})
		.catch(error => {
			this.setState({
				error
			});
		});
		this.loading(false);
	}


	async dislikePost (like) {
		await axios({
			url: `http://localhost:1337/like/${like.id}`,
			method: 'DELETE',
		})
		.then(response => {

			var posts = [ ...this.state.posts ];
			posts = posts.map(p => {
				if (p.id === (like.post?.id || like.post)) {

					var likes = [ ...p.likes ];
					const index = likes.findIndex( l => l.id === like.id );
					likes.splice(index, 1);

					return {
						...p,
						likes
					}
				}else return p;
			});

			this.setState({
				posts
			})
		})
		.catch(error => {
			alert(error);
			console.log(error);
		});
	}

	async likePost (post) {
		const user = this.props.user;
		// const post = this.state.post;

		await axios({
			url: `http://localhost:1337/like`,
			method: 'POST',
			data: {
				user: user.id,
				post: post.id
			}
		})
		.then(response => {
			const like = response.data;
			var posts = [ ...this.state.posts ];
			posts = posts.map(p => {
				if (p.id === post.id) {
					return {
						...post,
						likes: [
							...post.likes,
							like
						]
					}
				}else return p;
			});

			this.setState({
				posts
			})
		})
		.catch(error => {
			alert(error);
			console.log(error);
		});
	}


	/********************************************************************************************
	*--------------------------------------------
	* Misc Functions
	*--------------------------------------------
	********************************************************************************************/

	postIsLikedByMe(state, props) {
		const user = props.user;
		if (!user) return false;
		return state.post.likes.find( like => (like.user === user.id) || like.user.id === user.id );
	}

	postIsCommentedByMe(state, props) {
		const user = props.user;
		if (!user) return false;
		return state.post.comments.find( comment => (comment.user === user.id) || comment.user.id === user.id );
	}

	isLastPlace(index) {
		index += 1;
		const length = this.state.posts.length;
		return index > (length % 2 === 0 ? (length - 2) : length - 1);
	}

	/********************************************************************************************
	*--------------------------------------------
	* Sub Components
	*--------------------------------------------
	********************************************************************************************/

	renderLatest() {
		return (
			<div className="section">

			</div>
		);
	}

	renderCategories() {
		return (
			<div className="section">

			</div>
		);
	}

	renderPagination() {
		return (
			<div className="blog-posts-pagination text-center container-fluid">
				<div className="row">
					<div className="col-auto mx-auto">
						<ul className="pagination">
						    <li className="page-item">
						    	<a href="/#" className="page-link" disabled={ this.state.page <= 1 } onClick={ this.prev }>
						    		&lt;
						    	</a>
						    </li>
						    <li className="page-text">
						    	{ this.state.page }
						    </li>
						    <li className="page-item">
						    	<a href="/#" className="page-link" disabled={ this.state.page >= this.state.pages } onClick={ this.next }>
						    		&gt;
						    	</a>
						    </li>
						</ul>
					</div>
				</div>
			</div>
		);
	}

	renderPost(post, i) {
		return (
			<div className={`blog-posts-group-item${this.isLastPlace(i) ? ' last' : ''}`} key={ i }>

				<BlogItem post={ post } list={ true } dislikePost={ this.dislikePost } likePost={ this.likePost } />

				{/*<div>

					{ this.renderPostTags(post.tags) }

					<Link to={`/${post.id}`} className="blog-posts-group-item-title">
						{ post.title }
					</Link>

					<div className="blog-posts-group-item-a-d">
						{ this.renderPostAuthor(post.user) }

						{ this.renderPostDate(post.createdAt) }
					</div>

					<div className="blog-posts-group-item-body">
						{ post.body.truncate(300) }
					</div>

					{ this.renderPostMetaTags(post) }
					
				</div>*/}

			</div>
		);
	}

	renderPostAuthor(author) {
		return (
			<span className="blog-posts-group-item-author">
				by <Link to="/" className="blog-posts-group-item-author-name">{ author.firstName } { author.lastName }</Link>
			</span>
		);
	}

	renderPostDate(date) {

		const renderedDate = (new Date(date)).format('D, M Y');
		const renderedTime = (new Date(date)).format('h:ia');

		return (
			<span className="blog-posts-group-item-date">
				on 
				<Link to="/" className="ml-2">{ renderedDate } </Link>
				at 
				<Link to="/" className="mx-2">{ renderedTime } </Link>
			</span>
		);
	}

	renderPostTags(tags) {
		return (

			<div className="blog-posts-group-item-tags">
				{ tags && tags.map((tag, j) => 
					<Link to="/" className="blog-posts-group-item-tag" key={ j }>
						{ tag }
					</Link>
				) }
			</div>

		);
	}

	renderPostMetaTags(post) {

		function renderLikeIcon() {
			if (post.meta?.liked) {
				return <span className="icon ion-ios-heart"></span>;
			}else {
				return <span className="icon ion-ios-heart-empty"></span>;
			}
		}

		return (

			<div className="blog-posts-group-item-meta-tags">

				<div className={`blog-posts-group-item-meta-tag${post.meta?.liked ? ' liked' : ''}`} onClick={ () => this.handleLikeClick(post) } >
					{ renderLikeIcon() }
					<span className="text">Like</span>
					{ post.likes.count ? <span className="count">{ post.likes.count }</span> : null }
				</div>

				<div className={`blog-posts-group-item-meta-tag${post.meta?.commented ? ' commented' : ''}`}>
					<span className="icon ion-ios-chatbubbles"></span>
					<span className="text">Comment</span>
					{ post.comments.length ? <span className="count">{ post.comments.length }</span> : null }
				</div>

				<div className="blog-posts-group-item-meta-tag">
					<span className="icon ion-ios-paper-plane"></span>
					<span className="text">Share</span>
					<span className="count"></span>
				</div>
			</div>
			
		);
	}

	renderPosts() {
		return (
			<div className="blog-posts section">

				<div className="blog-posts-group">
					{ this.state.posts.map((post, i) => this.renderPost(post, i) ) }
				</div>

				{ this.renderPagination() }
				
			</div>
		);
	}

	renderTags() {
		return (
			<div className="section">

			</div>
		);
	}

	render() {
		if (this.state.loading) {
			return 'loading...';
		}else {
			return (
				<div className="blog-home">

					{/*{ this.renderLatest() }*/}

					{/*{ this.renderCategories() }*/}

					{ this.renderPosts() }

					{ this.renderTags() }

				</div>
			);
		}
	}

}

export default connect(
	state => ({
		posts: state.posts,
		loggedIn: state.loggedIn,
		user: state.user,
	}),
	dispatch => {
		return {
			likePost: (post) => dispatch({ type: 'LIKE_POST', post_id: post.id }),
			dislikePost: (post) => dispatch({ type: 'DISLIKE_POST', post_id: post.id }),
			addPosts: (posts) => dispatch({ type: 'ADD_POSTS', posts })
		}
	}
)( BlogList );