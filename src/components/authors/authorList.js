"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var AuthorActions = require('../../actions/authorActions');

var toastr = require('toastr');


var AuthorList = React.createClass({

	propTypes: {
		authors: React.PropTypes.array.isRequired
	},

	// It can be in controller view as props function
	// if this function only use here, it can use in here
	// if this function share with other places, then might put in controller view
	// Either places also ok
	deleteAuthor: function(id, event) {
		event.preventDefault();
		AuthorActions.deleteAuthor(id);
		toastr.success('Author Deleted');
	},

	render: function(){
		var _createAuthorRow = function(author){
			return (
				<tr key={author.id}>
					<td><a href="#" onClick={this.deleteAuthor.bind(this, author.id)}>Delete</a></td>
					<td><Link to="manageAuthor" params={{id: author.id}}>{author.id}</Link></td>
					<td>{author.firstName} {author.lastName}</td>
				</tr>
			);
		};
		return (
			<div>
				<table className="table">
					<thead>
						<th></th>
						<th>ID</th>
						<th>Name</th>
					</thead>
					<tbody>
						{this.props.authors.map(_createAuthorRow, this)}
					</tbody>
				</table>
			</div>
		);
	}

});

module.exports = AuthorList;