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

	const renderedDate = (new Date(state.post.createdAt)).format('D, M Y');
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
		<div className={`blog-post ${ props.preview ? 'blog-post-preview' : '' }`}>

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
						<div className="blog-post-title active">
							{ state.post.title }
						</div>
					);
				}
			})() }

			<div className="blog-post-a-d">
				{ renderPostAuthor(state) }

				{ renderPostDate(state) }
			</div>

			<div className="blog-post-body">
				<p>
					{ props.list ? state.post.body.truncate(200) : state.post.body }
				</p>

				{ null && <div>

					<p>
						Was certainty remaining engrossed applauded sir how discovery
					</p>

					<p>
						Affronting everything discretion men now own did. Still round match we to. Frankness pronounce daughters remainder extensive has but. Happiness cordially one determine concluded fat. Plenty season beyond by hardly giving of. Consulted or acuteness dejection an smallness if. Outward general passage another as it. Very his are come man walk one next. Delighted prevailed supported too not remainder perpetual who furnished. Nay affronting bed projection compliment instrument.
					</p>

					<p>
						Consulted he eagerness unfeeling deficient existence of. Calling nothing end fertile for venture way boy. Esteem spirit temper too say adieus who direct esteem. It esteems luckily mr or picture placing drawing no. Apartments frequently or motionless on reasonable projecting expression. Way mrs end gave tall walk fact bed.
					</p>

					<p>
						Necessary ye contented newspaper zealously breakfast he prevailed. Melancholy middletons yet understood decisively boy law she. Answer him easily are its barton little. Oh no though mother be things simple itself. Dashwood horrible he strictly on as. Home fine in so am good body this hope.
					</p>

					<p>
						Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten.
					</p>

					<p>
						Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the. Off nay impossible dispatched partiality unaffected. Norland adapted put ham cordial. Ladies talked may shy basket narrow see. Him she distrusts questions sportsmen. Tolerably pretended neglected on my earnestly by. Sex scale sir style truth ought.
					</p>

					<p>
						Any delicate you how kindness horrible outlived servants. You high bed wish help call draw side. Girl quit if case mr sing as no have. At none neat am do over will. Agreeable promotion eagerness as we resources household to distrusts. Polite do object at passed it is. Small for ask shade water manor think men begin.
					</p>

					<p>
						Surprise steepest recurred landlord mr wandered amounted of. Continuing devonshire but considered its. Rose past oh shew roof is song neat. Do depend better praise do friend garden an wonder to. Intention age nay otherwise but breakfast. Around garden beyond to extent by.
					</p>

					<p>
						Luckily friends do ashamed to do suppose. Tried meant mr smile so. Exquisite behaviour as to middleton perfectly. Chicken no wishing waiting am. Say concerns dwelling graceful six humoured. Whether mr up savings talking an. Active mutual nor father mother exeter change six did all.
					</p>

					<p>
						Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In on my jointure horrible margaret suitable he followed speedily. Indeed vanity excuse or mr lovers of on. By offer scale an stuff. Blush be sorry no sight. Sang lose of hour then he left find.
					</p>
					
				</div> }

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
