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
		}

		this.addItem = this.addItem.bind(this)
	}

	addItem(item) {
		//fetch("/create-todo", { method: "POST", body:"name=" + encodeURIComponent(item), headers:{"content-type": 'application/x-www-form-urlencoded; charset=utf-8'}})
		
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
		console.log("the ITEM is", item_id);
		console.log("IN REMOVE ITEM", this.state.items);
		if(i !== -1) {
			console.log("in removeItem", this.state.items);
			//this.state.items.splice(i, 1);
			// fetch("/todos/:todo_id", { method: "DELETE", body:"name=" + encodeURIComponent(item_id), headers:{"content-type": 'application/x-www-form-urlencoded; charset=utf-8'}})
			// .then(response => console.log(response))

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


		// return this.setState({ items: this.state.items })
	}

	editItemStart(item) {
		var i = this.state.items.indexOf(item);
		if(i !== -1) {
			this.state.showEdit = true;
			this.state.wordToEdit = item;
			this.setState({ showEdit: true});
			this.setState({wordToEdit: item});
		}
	}

	editItem(item) {
		var i = this.state.items.indexOf(this.state.wordToEdit);
		if (i !== -1) {
			this.state.items[i] = item;
			this.state.wordToEdit = '',
			this.state.showEdit = false;
		}
		return this.setState({ items: this.state.items, wordToEdit: this.state.wordToEdit, showEdit: this.state.showEdit});
	}

	render() {
		if(this.state.showEdit) {
			return <div><EditItemForm wordToEdit={this.state.wordToEdit} editItem={this.editItem.bind(this)} /> </div>
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
