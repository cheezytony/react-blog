import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Textarea } from '../../components/form.js';
import BlogItem from './Item';
import axios from 'axios';
import $ from 'jquery';

class BlogPost extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			post: null,
			nextPost: null,
			prevPost: null,
			likePost: props.likePost,
			dislikePost: props.dislikePost,
			postComment: props.postComment,
			showCommentFormInput: false,
			comment: '',
			shouldRender: true,
			loading: false
		}

		// this.handleLikeClick = this.handleLikeClick.bind(this);
		this.handleCommentFormCLick = this.handleCommentFormCLick.bind(this);
		this.handleCommentInputBlur = this.handleCommentInputBlur.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
		this.dislikePost = this.dislikePost.bind(this);
		this.likePost = this.likePost.bind(this);

		this.commentInput = React.createRef();
	}

	/********************************************************************************************
	*--------------------------------------------
	* Life Cycle
	*--------------------------------------------
	********************************************************************************************/

	UNSAFE_componentWillMount() {
		this.getPost();
	}

	componentDidMount() {
		this.listen();
	}

	componentWillUnmount() {
		this.setState({
			shouldRender: false
		});
	}

	componentDidUpdate() {
		
	}

	/********************************************************************************************
	*--------------------------------------------
	* Event Handlers
	*--------------------------------------------
	********************************************************************************************/

	handleCommentFormCLick() {
		this.setState({
			showCommentFormInput: true
		});

		this.commentInput.current.focus();
	}

	handleCommentInputBlur(event) {
		// if (!this.state.comment.length) {
		// 	this.setState({
		// 		showCommentFormInput: false
		// 	});
		// }
	}

	async handleCommentSubmit(event) {
		event.preventDefault();
		const comment = this.state.comment;
		if (comment.length) {
			await this.postComment();
		}
	}

	listen() {
		$(window).click((event) => {
			if (event.target.matches('.blog-post-comments-form, .blog-post-comments-form *') && !event.target.matches('a, button')) {
				if (this.commentInput && this.commentInput.current) {
					this.commentInput.current.focus();
				}
			}else {
				this.setState({
					showCommentFormInput: !!this.state.comment || false
				});
			}
		});

		$('body').on('focus', '*', (event) => {
			if (!event.target.matches('.blog-post-comments-form, .blog-post-comments-form *')) {
				if (this.state.shouldRender) {
					this.setState({
						showCommentFormInput: !!this.state.comment || false
					});
				}
			}
		});
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

	async getPost() {

		const post_id = this.props.match.params.post_id;

		this.loading(true);
		await axios.get(`http://localhost:1337/post/${post_id}`)
		.then(response => {
			this.setState({
				post: response.data.post,
				nextPost: response.data.nextPost,
				prevPost: response.data.prevPost
			});
		})
		.catch(error => {

		});
		this.loading(false);
	}

	async dislikePost (like) {
		await axios({
			url: `http://localhost:1337/like/${like.id}`,
			method: 'DELETE',
		})
		.then(response => {
			var likes = [ ...this.state.post.likes ];

			const index = likes.findIndex( l => l.id === like.id );

			likes.splice(index, 1);

			this.setState({
				post: {
					...this.state.post,
					likes: [
						...likes
					]
				}
			})
		})
		.catch(error => {
			alert(error);
			console.log(error);
		});
	}

	async likePost () {
		const user = this.props.user;
		const post = this.state.post;

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
			this.setState({
				post: {
					...this.state.post,
					likes: [
						...this.state.post.likes,
						like
					]
				}
			})
		})
		.catch(error => {
			alert(error);
			console.log(error);
		});
	}

	async postComment() {

		const data = {
			text: this.state.comment,
			user: this.props.user.id,
			post: this.state.post.id
		};

		await axios({
			url: 'http://localhost:1337/comment',
			method: 'POST',
			data
		})
		.then(response => {
			const comment = response.data;
			this.state.postComment(this.state.post, comment);
			this.setState({
				comment: '',
				showCommentFormInput: false,
				post: {
					...this.state.post,
					comments: [
						...this.state.post.comments,
						{ ...comment, isNew: true }
					]
				}
			});
		})
		.catch(error => {
			alert(error);
		});
	}

	/********************************************************************************************
	*--------------------------------------------
	* Sub Components
	*--------------------------------------------
	********************************************************************************************/

	renderComment(comment, i) {
		const renderedDate = (new Date(comment.createdAt)).format('D, M Y');
		const renderedTime = (new Date(comment.createdAt)).format('h:ia');

		return (
			<div className={`blog-post-comment${ comment.isNew ? ' new' : '' }`} key={ i }>
				<div className="blog-post-comment-author">
					Comment by <Link to="/" className="blog-post-comment-author-name">{ comment.author }</Link>
				</div>
				<div className="blog-post-comment-text">{ comment.text }</div>
				<div className="blog-post-comment-date-time">
					on <Link to="/" className="blog-post-comment-date mx-1">{ renderedDate }</Link>
					at <Link to="/" className="blog-post-comment-time ml-1">{ renderedTime }</Link>
				</div>
			</div>
		);
	}

	renderComments() {
		var comments = this.state.post.comments;
		return (
			<div className="blog-post-comments">
				<div className="blog-post-comments-count">
					{ comments.length } comment{ comments.length !== 1 ? 's' : '' }
				</div>

				{ comments.map( (comment, i) => this.renderComment(comment, i) ) }
			</div>
		);
	}

	renderCommentForm() {
		if (this.props.loggedIn) {
			return (
				<form
					className={`blog-post-comments-form${ this.state.showCommentFormInput ? ' show' : '' }`}
					onClick={this.handleCommentFormCLick}
					onSubmit={(event) => this.handleCommentSubmit(event)}>
					<div className="blog-post-comments-form-section">
						<div className="blog-post-comments-form-avatar">
							<span className="ion-ios-person"></span>
						</div>
						<div className="blog-post-comments-form-placeholder">
							{(() => {
								if (this.state.showCommentFormInput) {
									return <span>
										Post a comment as 
										<Link to="/" className="link-tag ml-1">
											{ this.props.user.firstName } { this.props.user.lastName }
										</Link>
									</span>
								}else {
									return 'Post a comment';
								}
							})()}
						</div>
					</div>
					<div className="blog-post-comments-form-section">
						<Textarea 
							className="blog-post-comments-form-input"
							model="comment"
							state={ this.state }
							placeholder="Enter Comments"
							onBlur={ this.handleCommentInputBlur }
							inputRef={ this.commentInput } />
					</div>
					<div className="blog-post-comments-form-section mt-4">
						{/*<button type="button" className="btn btn-danger mr-auto">Cancel</button>*/}
						<button
							type="submit"
							className="blog-post-comments-form-submit btn btn-outline-primary"
							disabled={ !this.state.showCommentFormInput }>Post</button>
					</div>
				</form>
			);
		}else {
			return (
				<div className="blog-post-comments-form">
					<div className="blog-post-comments-form-placeholder">Login to post a comment</div>
				</div>
			);
		}
	}

	renderCommentsSection() {
		return (
			<div className="blog-post-comments-section section">

				{ this.renderComments() }

				{ this.renderCommentForm() }

			</div>
		);
	}

	renderPagination() {

	}

	renderMiniMap() {
		const post = this.state.post;
		var map = [];
		// Push Post Title
		map.push({ type: 'title', title: post.title, className: 'blog-post-mini-map-title' });
		// Push Post Body
		map.push({ type: 'body', title: post.body, className: 'blog-post-mini-map-body' });

		post.comments.forEach( comment => {
			map.push({ type: 'comment', title: comment.text, className: 'blog-post-mini-map-comment', isNew: comment.isNew });
		} );

		return (
			<div className="blog-post-mini-map">
				{ map.map( (item, i) =>
					<div className={`blog-post-mini-map-item ${ item.className } ${ item.isNew ? 'new' : '' }`} key={ i }>
						<div className="blog-post-mini-map-item-type">
							{ item.type }
						</div>
						<div className="blog-post-mini-map-item-title">
							{ item.title?.truncate(35) }
						</div>
					</div>
				) }
			</div>
		);
	}

	renderPost() {
		return <BlogItem post={ this.state.post } dislikePost={ this.dislikePost } likePost={ this.likePost } />;
	}

	render() {
		if (!this.state.shouldRender) {
			return null;
		}
		if (this.state.loading) {
			return 'Loading';
		}else {
			return (
				<div className="blog-post-container section">
					<div className="row">
						<div className="col-sm-9">
							
							{ this.renderPost() }

							{ this.renderCommentsSection() }

							{ this.renderPagination() }

						</div>
						<div className="col-sm-3">
							{ this.renderMiniMap() }
						</div>
					</div>
				</div>
			);
		}
	}
}

export default connect(
	state => ({
		user: state.user,
		token: state.token,
		loggedIn: state.loggedIn
	}),
	dispatch => ({
		likePost: (post) => dispatch({ type: 'LIKE_POST', post_id: post.id }),
		dislikePost: (post) => dispatch({ type: 'DISLIKE_POST', post_id: post.id }),
		postComment: (post, comment) => dispatch({ type: 'POST_COMMENT', post_id: post.id, comment }),
	})
)(BlogPost);