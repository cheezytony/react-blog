import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

/********************************************************************************************
*--------------------------------------------
* Life Cycle
*--------------------------------------------
********************************************************************************************/

/********************************************************************************************
*--------------------------------------------
* Event Handlers
*--------------------------------------------
********************************************************************************************/

function handleLikeClick(state, props) {
	const liked = postIsLikedByMe(state, props);
	if (liked) {
		props.dislikePost(liked);
	}else {
		props.likePost(props.post);
	}
	// this.forceUpdate();
}


/********************************************************************************************
*--------------------------------------------
* Misc Functions
*--------------------------------------------
********************************************************************************************/

function postIsLikedByMe(state, props) {
	const user = props.user;
	if (!user) return false;
	return state.post.likes.find( like => (like.user === user.id) || like.user.id === user.id );
}

function postIsCommentedByMe(state, props) {
	const user = props.user;
	if (!user) return false;
	return state.post.comments.find( comment => (comment.user === user.id) || comment.user.id === user.id );
}


/********************************************************************************************
*--------------------------------------------
* Sub Components
*--------------------------------------------
********************************************************************************************/

function renderPostFeaturedImage(state) {
	if (!state.post.featuredImage) {
		return null;
	}

	return (
		<div className="blog-post-featured-image">
			<img src={ `http://localhost:1337/post/${state.post.id}/image` } alt={ state.post.title }/>
		</div>
	);
}

function renderPostTags(state) {
	return (
		<div className="blog-post-tags">
			{ state.post.tags && state.post.tags.map((tag, j) => 
				<Link to={`/tag/${tag.id}`} className="blog-post-tag" key={ j }>
					{ tag.title }
				</Link>
			) }
		</div>
	);
}

function renderPostAuthor(state) {
	const author = state.post.user;

	return (
		<span className="blog-post-author">
			by <Link to={`/user/${author.id}`} className="blog-post-author-name">
				{ author.firstName } { author.lastName }
			</Link>
		</span>
	);
}

function renderPostDate(state) {

	const renderedDate = (new Date(state.post.createdAt)).format('D, dd M Y');
	const renderedTime = (new Date(state.post.createdAt)).format('h:ia');

	return (
		<span className="blog-post-date">
			on 
			<Link to="/" className="ml-2">{ renderedDate } </Link>
			at 
			<Link to="/" className="mx-2">{ renderedTime } </Link>
		</span>
	);
}

function renderPostMetaTags(state, props) {

	const post = state.post;

	function renderLikeIcon() {
		if (postIsLikedByMe(state, props)) {
			return <span className="icon ion-ios-heart"></span>;
		}else {
			return <span className="icon ion-ios-heart-empty"></span>;
		}
	}

	return (

		<div className="blog-post-meta-tags">

			<div className={`blog-post-meta-tag${postIsLikedByMe(state, props) ? ' liked' : ''}`} onClick={ () => handleLikeClick(state, props) } >
				{ renderLikeIcon() }
				<span className="text">Like</span>
				{ post.likes.length ? <span className="count">{ post.likes.length }</span> : null }
			</div>

			<div className={`blog-post-meta-tag${postIsCommentedByMe(state, props) ? ' commented' : ''}`}>
				<span className="icon ion-ios-chatbubbles"></span>
				<span className="text">Comment</span>
				{ post.comments.length ? <span className="count">{ post.comments.length }</span> : null }
			</div>

			<div className="blog-post-meta-tag">
				<span className="icon ion-ios-paper-plane"></span>
				<span className="text">Share</span>
				<span className="count"></span>
			</div>

		</div>
		
	);
}


function BlogItem (props) {
	const state = {
		post: props.post,
	}

	return (
		<div className={`blog-post ${ props.list ? 'blog-post-item' : props.preview ? 'blog-post-preview' : '' }`}>

			{ renderPostFeaturedImage(state) }

			{ renderPostTags(state) }

			{ (() => {
				if (props.list) {
					return (
						<Link to={ `/${state.post.id}` } className="blog-post-title">
							{ state.post.title }
						</Link>
					);
				}else {
					return (
						<h1 className="blog-post-title active">
							{ state.post.title }
						</h1>
					);
				}
			})() }

			<div className="blog-post-a-d">
				{ renderPostAuthor(state) }

				{ renderPostDate(state) }
			</div>

			<div className="blog-post-body" dangerouslySetInnerHTML={ { __html: props.list ? state.post.body.truncate(200) : state.post.body  } }>
			</div>

			{ !props.preview && renderPostMetaTags(state, props) }

		</div>
	);
}

export default connect(
	state => ({
		loggedIn: state.loggedIn,
		token: state.token,
		user: state.user,
	}),
	dispatch => ({
	})
)(BlogItem);
