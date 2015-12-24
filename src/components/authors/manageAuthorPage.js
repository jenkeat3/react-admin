"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');


var Toaster = require('toastr');

var ManageAuthorPage = React.createClass({
	mixins: [
		Router.Navigation
	],

	statics: {
		willTransitionFrom: function(transition, component) {
			// our component not yet save
			if (component.state.dirty && !confirm('Leave without saving?')) {
				// Cancel and do not move
				transition.abort();
			}
		}
	},

	getInitialState: function() {
		return {
			author: {id: '', firstName: '', lastName: ''},
			errors: {},
			dirty: false
		};
	},

	componentWillMount: function() {
		// Calling this method/function will not cause re-render
		var authorId = this.props.params.id; //from the path '/author:id'

		if (authorId) {
			this.setState({ author: AuthorStore.getAuthorById(authorId)});
		}

	},

	_setAuthorState: function(event) {
		this.setState({dirty: true});
		var field = event.target.name;
		var value = event.target.value;

		this.state.author[field] = value;
		return this.setState({author: this.state.author});
	},

	_authorFormIsValid: function() {
		var formIsValid = true;
		this.state.errors = {}; // clear any previous error

		if (this.state.author.firstName.length < 3) {
			this.state.errors.firstName = 'First name must be at least 3 characters';
			formIsValid = false;
		}

		if (this.state.author.lastName.length < 3) {
			this.state.errors.lastName = 'Last name must be at least 3 characters';
			formIsValid = false;
		}

		this.setState({errors: this.state.errors});
		return formIsValid;
	},

	_saveAuthor: function(event) {
		event.preventDefault();
		if (!this._authorFormIsValid()){
			return;
		}

		if (this.state.author.id) {
			AuthorActions.updateAuthor(this.state.author);
		} else {
			AuthorActions.createAuthor(this.state.author);
		}
		
		this.setState({dirty: false});
		Toaster.success('Author saved.');
		this.transitionTo('authors');
	},

	render: function() {
		return (
			<AuthorForm 
				author={this.state.author} 
				onChange={this._setAuthorState} 
				onSave={this._saveAuthor}
				errors={this.state.errors} />
		);
	}

});

module.exports = ManageAuthorPage;