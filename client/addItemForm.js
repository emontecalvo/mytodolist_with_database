import React from 'react';
import {connect} from 'react-redux';


const AddItemForm = ({addItem}) => {

		return(
			 <div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            let userInput = e.target.userInput.value
            addItem(userInput)
            e.target.userInput.value = ''
          }}
        >

          <input type="text" placeholder="Enter an item" name="userInput" />

        <button type="submit">
          Add Item
        </button>
      </form>
			</div>
		)

}

module.exports = AddItemForm;


// var ListItems = React.createClass({
//   render: function() {
//     var that = this
//     return (
//       <ul>
//       {items.map((item, index) => {
//         console.log("THAT IS:", that);
//         return <li key={index}>{item} <button onClick={() => that.props.removeItem(item)}>remove</button></li>;
//       })}
//     </ul>
//       )
//   }
// })








			 	// <form onSubmit={(e) => {
			 	// 	e.preventDefault()
			 	// 	let userInput = e.target.userInput.value
			 	// 	addItem(userInput)
			 	// 	e.target.userInput.value = '' }}>
			 	// 	<input type="text" placeholder="item you wan to add" />
			 	// 	<input type="submit" />
			 	// </form>
