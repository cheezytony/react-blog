import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import BlogItem from './Item';
import { Input, Textarea, Dropzone } from '../../components/form';
import axios from 'axios';

class NewPost extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// Form Data
			title: '',
			body: '',
			tags: [],
			tag: '',
			featuredImage: null,

			// Post Preview Data
			post: {
				user: props.user,
				title: '',
				body: '',
				tags: [],
				featuredImage: null,
				createdAt: (new Date()).toString()
			},

			// Form Submission Data
			loading: false,
			error: null,
			success: false,
			savedPost: null,

			// Authentication Data
			loggedIn: props.loggedIn,
			user: props.user,
			token: props.token,
		}
		// Bind Actions To Scope
		this.tagInputKeyUp = this.tagInputKeyUp.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}


	/********************************************************************************************
	*--------------------------------------------
	* Life Cycle
	*--------------------------------------------
	********************************************************************************************/

	componentDidUpdate(prevProps, prevState) {
		if (prevState.title !== this.state.title) {
			this.updatePost('title', this.state.title);
		}

		if (prevState.body !== this.state.body) {
			this.updatePost('body', this.state.body);
		}

		if (prevState.tags !== this.state.tags) {
			this.updatePost('tags', this.state.tags);
		}

		if (prevState.featuredImage !== this.state.featuredImage) {
			this.updatePost('featuredImage', this.state.featuredImage);
		}
	}

	/********************************************************************************************
	*--------------------------------------------
	* Event Handlers
	*--------------------------------------------
	********************************************************************************************/

	tagInputKeyUp(event) {
		if (event.key !== 'Enter') return;

		const tag = this.state.tag;
		if (!tag) return;

		this.addTag(tag);
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

	addTag(tag) {
		if (this.state.tags.find(t => t === tag)) return;

		this.setState({
			tags: [
				...this.state.tags,
				tag
			],
			tag: ''
		});

	}

	removeTag(tag) {
		const i = this.state.tags.findIndex( t => t === tag );
		var tags = [...this.state.tags];
		tags.splice(i, 1);
		this.setState({
			tags
		});
	}

	updatePost(key, value) {
		this.setState({
			post: {
				...this.state.post,
				[key]: value
			}
		});
		this.forceUpdate();
	}

	async submitForm(event) {
		event.preventDefault();

		const formdata = new FormData();

		formdata.append('title', this.state.title);
		formdata.append('body', this.state.body);
		formdata.append('tags', JSON.stringify(this.state.tags));
		formdata.append('user', this.state.user.id);
		formdata.append('featuredImage', this.state.featuredImage);

		var data = formdata;

		this.loading(true);

		await axios({
			url: 'http://localhost:1337/post',
			method: 'POST',
			data,
			headers: {
				// 'Content-Type': 'application/json',
	            'Content-Type': 'multipart/form-data; boundary=----',
			}
		})
		.then(response => {
			this.setState({
				success: true,
				savedPost: response.data.post,
				title: '',
				body: '',
				tags: [],
				tag: '',
				featuredImage: null,
			})
		})
		.catch(error => {
			this.setState({
				error
			})
		});

		this.loading(false);
	}

	/********************************************************************************************
	*--------------------------------------------
	* Sub Components
	*--------------------------------------------
	********************************************************************************************/

	renderPostTags() {
		return (
			<div className="blog-post-tags">
				{ this.state.tags && this.state.tags.map((tag, i) => 
					<span
						className="blog-post-tag"
						key={ i }
						onClick={ () => this.removeTag(tag) }>
						{ tag }
					</span>
				) }
			</div>
		);
	}

	renderForm() {
		return (
			<div className="new-post">

				<div className="form-group">
					<label htmlFor="post-tags" className="form-label">
						Enter tags so people can easily find your post
					</label>
					<Input
						className="form-control"
						id="post-tags"
						model="tag"
						state={ this.state }
						placeholder="Select post tags"
						onKeyUp={ this.tagInputKeyUp }
						autoFocus />
					<small className="font-weight-light op-6 mt-3">Selected Tags:</small>
					{ this.renderPostTags() }
					{ (() => {
						if (this.state.tags.length) {
							return <small className="font-weight-light op-3 mt-3">click to remove</small>
						}
					})() }
				</div>
				
				<form onSubmit={ this.submitForm }>

					<div className="form-group">
						<label htmlFor="post-image" className="form-label">
							Select an amazing feature image to grab readers' attentions
						</label>
						<Dropzone
							id="post-image"
							model="featuredImage"
							state={ this.state }
							accept=".jpg, .png, .gif, .svg"
							placeholder="Select Featured Image" />
					</div>

					<div className="form-group">
						<label htmlFor="post-title" className="form-label">
							Enter an intriguing title to lure people in
						</label>
						<Input
							className="form-control"
							id="post-title"
							model="title"
							state={ this.state }
							placeholder="Enter post title" />
					</div>

					<div className="form-group">
						<label htmlFor="post-body" className="form-label">
							Now enter fulfilling content so people won't regret clicking on your post
						</label>
						<Textarea
							className="form-control"
							id="post-body"
							model="body"
							state={ this.state }
							placeholder="Enter post content" />
					</div>

					{ (() => {
						return this.state.success && this.state.savedPost && (
							<div className="alert alert-success">
								<p className="font-weight-normal">Post Published!</p>
								<p className="font-weight-light mb-4">
									Check your post out to see if it turned out the way you expected.
								</p>
								<Link to={`/${this.state.savedPost.id}`} className="btn btn-success">View Post</Link>
							</div>
						);
					})() }

					<button type="submit" className="btn btn-outline-primary mr-2">
						Publish Post
					</button>

					<Link to="/" className="btn btn-outline-warning">
						Cancel
					</Link>

				</form>

			</div>
		);
	}

	renderPreview() {
		return (
			<div className="new-post-preview">
				<BlogItem post={ this.state.post } preview={ true } />
			</div>
		);
	}

	/********************************************************************************************
	*--------------------------------------------
	* Render
	*--------------------------------------------
	********************************************************************************************/


	render() {
		if (!this.state.loggedIn) {
			return <Redirect to="/login" />
		}else {
			return (
				<div className="section">
					<div className="row">
						<div className="col-md-8">
							{ this.renderForm() }
						</div>
						<div className="col-md-4">
							{ this.renderPreview() }
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
		loggedIn: state.loggedIn,
		token: state.loggedIn
	}),
	dispatch => ({
		likePost: (post) => dispatch({ type: 'LIKE_POST', post_id: post.id }),
		dislikePost: (post) => dispatch({ type: 'DISLIKE_POST', post_id: post.id }),
	})
)(NewPost);