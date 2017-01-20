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

