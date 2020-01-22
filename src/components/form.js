import React from "react";
import TextareaAutosize from 'react-textarea-autosize';
import ReactDOM from "react-dom";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
			value,
			files: []
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

		if (this.constructor === Editor) {
			value = this.state.instance.getData();
		}else if (event.target.matches('input[type="file"][multiple]')) {
			value = event.target.files;
		}else if (event.target.matches('input[type="file"]')) {
			value = event.target.files[0];
		}else if (event.target.matches('input[type="checkbox"], input[type="radio"]')) {
			value = event.target.checked;
		}else {
			value = event.target.value;
		}

		if (event.target?.matches('input[type="file"]')) {
			const files = [...event.target.files];
			this.setState({
				files: files
			});
			console.log(this);
			this.forceUpdate();
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

class Editor extends formElement {

	handleEditorChange(event, editor) {
		const parent = this._reactInternalFiber._debugOwner.stateNode;
		const value = editor.getData();

		parent.setState({
			[this.state.model]: value
		});
	}

	render() {
		return (
			<CKEditor
				{ ...this.props }
				editor={ ClassicEditor }
				onChange={ (event, editor) => this.handleEditorChange(event, editor)}
				onInit={ instance => { this.setState({ instance }) } } />
		);
	}
}

class Dropzone extends formElement {

	renderFiles() {
		return (
			<div className="dropzone-files">
				{ this.state.files.map( (file, i) => this.renderFile(file, i) ) }
			</div>
		);
	}

	renderFile(file, i) {
		return (
			<div className="dropzone-file" key={ i } >
				<div className="dropzone-file-icon ion-md-document"></div>
				<div className="dropzone-file-details">
					<div className="dropzone-file-name">{ file.name }</div>
					<div className="dropzone-file-size">{ file.size } bytes</div>
					<div className="dropzone-file-type">{ file.type }</div>
				</div>
			</div>		
		);
	}

	fileOrPreview() {
		if (this.state.files?.length) {
			return (
				<div className="dropzone-files">
					{ this.renderFiles() }
				</div>
			);
		}

		return (
			<div className="dropzone-preview">
				<div className="dropzone-preview-icon ion-md-document"></div>
				<div className="dropzone-preview-text">
					{ this.props.placeholder || 'Select a file to upload' }
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="dropzone">
				<input
					type="file"
					className="dropzone-input"
					onChange={(event) => this.handleInputChange(event, this.state.model, this.state.state)}
					{ ...this.props } />
				{ this.fileOrPreview() }
			</div>
		);
	}
}

export {
	Input,
	Textarea,
	File,
	Editor,
	Dropzone
}