import React from 'react';
import {connect} from 'react-redux';


const editItemForm = ({objectToEdit, editItem}) => {

    return(
       <div>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        let userInput = e.target.userInput.value
        objectToEdit.name = userInput
        editItem(objectToEdit)
        e.target.userInput.value = ''
      }}
    >

      <input type="text" defaultValue={objectToEdit.name} name="userInput" />

    <button type="submit">
      Save Edit
    </button>
  </form>
      </div>
    )

}

module.exports = editItemForm;