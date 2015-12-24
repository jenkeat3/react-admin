"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');

// Event emitter notify react component store changed
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
//assign ({a:1}, {b:2}) => {a:1, b:2}
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

// underscore variable naming for private
var _authors = [];

var AuthorStore = assign({}, EventEmitter.prototype, {

	// React compoent, I would like to know when store changed
	addChangeListener: function(callback) {
		// Change and call callback
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	getAllAuthors: function() {
		return _authors;
	},

	getAuthorById: function(id) {
		return _.find(_authors, {id: id});
	}

});

// author Action Dispatcher.dispatch to here
Dispatcher.register(function(action){

	switch(action.actionType) {
		case ActionTypes.INITIALIZE:
			// this initialData author from initializeAction
			_authors = action.initialData.authors;
			AuthorStore.emitChange();
			break;
		case ActionTypes.CREATE_AUTHOR:
			_authors.push(action.author);
			// Any store that add change listener will be notify
			AuthorStore.emitChange();
			break;
		case ActionTypes.UPDATE_AUTHOR:
			var existingAuthor = _.find(_authors, {id: action.author.id});
			// Get the index position
			var existingAuthorIndex = _.indexOf(_authors, existingAuthor); 
			// replace the existing author with new author
			_authors.splice(existingAuthorIndex, 1, action.author);
			AuthorStore.emitChange();
			break;
		case ActionTypes.DELETE_AUTHOR:
			_.remove(_authors, function(author) {
				return action.id === author.id;
			});
			
			AuthorStore.emitChange();
			break;
		default:
			// no op
	}

});

module.exports = AuthorStore;