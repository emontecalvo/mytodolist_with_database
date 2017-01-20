import React from 'react';
import {connect} from 'react-redux';
import AddItemForm from './addItemForm';
import ListItems from './listitems';
import EditItemForm from './editItemForm';

class Home extends React.Component {

	constructor() {
		super()
		this.state = {
			items: [],
			showEdit: false,
			wordToEdit: '',
			objectToEdit: '',
		}
		this.addItem = this.addItem.bind(this)
	}

	addItem(item) {		
		fetch('/create-todo', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    name: item
		  })
		}).then((response) => {
		    return response.json()
		  }).then((data) => {
		   	this.setState({ items: data })
		  })
	}

	componentDidMount() {
		fetch('/todos')
		  .then((response) =>{
		    return response.json()
		  }).then((data) =>{
		    this.setState({ items: data })
		  })
	}

	removeItem(item_id) {
		var i;
		for (var j = 0; j < this.state.items.length; j++) {
			if (this.state.items[j]._id === item_id) {
				var i = this.state.items[j];
			}
		}
		if(i !== -1) {
			fetch('/todos/' + item_id, {
		  		method: 'DELETE',
		  		headers: {
		    	'Content-Type': 'application/json'
		  	},
		  	body: JSON.stringify({
		    id: item_id
		  })
		}).then((response) => {
		    return response.json()
		  }).then((data) => {
		   	this.setState({ items: data })
		  })
		}
	}

	editItemStart(item_id) {
		var i;
		for (var j = 0; j < this.state.items.length; j++) {
			if (this.state.items[j]._id === item_id) {
				i = this.state.items[j];
			}
		}
		if (i !== -1) {
			this.state.showEdit = true;
			this.state.wordToEdit = i.name;
			this.state.objectToEdit = i;
			this.setState({ showEdit: true});
			this.setState({wordToEdit: i.name});
			this.setState({objectToEdit: i});
		}
	}

	editItem(item_obj) {

		console.log("item here", item_obj);
		var i;
		for (var j = 0; j < this.state.items.length; j++) {
			if (this.state.items[j]._id === item_obj._id) {
				i = this.state.items[j];
				console.log("i is:", i);
			}
		}

		//this.state.items[i].name = item_obj.name;
		this.state.wordToEdit = '',
		this.state.objectToEdit = '',
		this.state.showEdit = false;
		fetch('/edittodos/' + item_obj, { // this is sending req.params
		  		method: 'PUT',
		  		headers: {
		    	'Content-Type': 'application/json'
		  	},
		  	body: JSON.stringify({  /// this is the req.body, this is being passed to the server
		    item: item_obj
		  })
		}).then((response) => {
		    return response.json()
		  }).then((data) => {
		  	console.log("data in editItem is", data)
		  	var item_sub = [];
		  	for (var a = 0; a < this.state.items.length; a++) {
		  		if (this.state.items[a]._id !== data._id) {
		  			item_sub.push(this.state.items[a]);
		  		} else {
		  			item_sub.push(data);
		  		}
		  	}
		  	console.log("state items:", this.state.items);
		  	console.log("item_sub", item_sub);
		   	this.setState({ items: item_sub });

		  })
	}

	render() {
		if(this.state.showEdit) {
			return <div><EditItemForm objectToEdit={this.state.objectToEdit} editItem={this.editItem.bind(this)} /> </div>
		} else {
			return <div>
				<h1>my to-do list</h1>
				<AddItemForm addItem={this.addItem}/>
				<ListItems
					removeItem={this.removeItem.bind(this)}
					editItemStart={this.editItemStart.bind(this)}
					items={this.state.items}
				/>
			</div>;
		}
	}
}

module.exports = Home;
