import React from "react";
import TextareaAutosize from 'react-textarea-autosize';
import ReactDOM from "react-dom";

class formElement extends React.Component {

	constructor(props) {
		super(props);
		var model = props?.model;
		var state = props?.state;
		var value;
		if (state && model) {
			value = state[model];
		}
		this.state = {
			model,
			state,
			value
		}
	}

	componentDidMount() {
		this.$el = ReactDOM.findDOMNode(this);
		this.$el.value = this.state.value;
		this.$parent = this._reactInternalFiber._debugOwner.stateNode;
	}

	handleInputChange(event, model, state) {
		var parent = this._reactInternalFiber._debugOwner.stateNode;
		var value;

		if (event.target.matches('input[type="file"][multiple]')) {
			value = event.target.files;
		}else if (event.target.matches('input[type="file"]')) {
			value = event.target.files[0];
		}else if (event.target.matches('input[type="checkbox"], input[type="radio"]')) {
			value = event.target.checked;
		}else {
			value = event.target.value;
		}

	    parent.setState({
	    	[model]: value
	    });
	}

	getSnapshotBeforeUpdate(prevProps) {
		return { changed: prevProps.state[prevProps.model] !== this.props.state[this.props.model] };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const newValue = this.props.state[this.props.model];
		// const oldValue = prevProps.state[prevProps.model];
		if (snapshot.changed) {
			// Set input value
			if (this.$el.matches('input[type="file"]')) {
				// this.$el.files = newValue;
			}else if (this.$el.matches('input[type="checkbox"], input[type="radio"]')) {
				this.$el.checked = newValue;
			}else {
				this.$el.value = newValue;
			}
		}
	}

}

class Input extends formElement {
	render() {
		return <input { ...this.props } onChange={(event) => this.handleInputChange(event, this.state.model, this.state.state)} />;
	}
}

class Textarea extends formElement {
	render() {
		return <TextareaAutosize { ...this.props } onChange={(event) => this.handleInputChange(event, this.state.model, this.state.state)} ></TextareaAutosize>;
	}
}

class File extends formElement {
	render() {
		return <input type="file" { ...this.props } onChange={(event) => this.handleInputChange(event, this.state.model, this.state.state)} />;
	}
}

export {
	Input,
	Textarea,
	File
}