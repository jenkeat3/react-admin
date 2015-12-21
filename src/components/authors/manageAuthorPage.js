"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorApi = require('../../api/authorApi');
var Toaster = require('toastr');

var ManageAuthorPage = React.createClass({
	mixins: [
		Router.Navigation
	],

	getInitialState: function() {
		return {
			author: {id: '', firstName: '', lastName: ''},
			errors: {}
		};
	},

	_setAuthorState: function(event) {
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
		AuthorApi.saveAuthor(this.state.author);
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