import React from 'react';
import {connect} from 'react-redux';


//var ListItems = React.createClass({})
const ListItems = ({ items, removeItem, editItemStart }) => {
  return (
    <ul>
      {items.map((item, index) => {
        return <li
                  key={index}>{item.name}
                  <button onClick={() => removeItem(item._id)}>remove</button>
                  <button onClick={() => editItemStart(item.name)}>edit</button>
              </li>;
      })}
    </ul>
  )
}

module.exports = ListItems;



