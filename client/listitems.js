import React from 'react';
import {connect} from 'react-redux';


const ListItems = ({ items, removeItem, editItemStart }) => {
  return (
    <ul>
      {items.map((item, index) => {
        return <li
                  key={index}>{item.name}
                  <button onClick={() => removeItem(item._id)}>remove</button>
                  <button onClick={() => editItemStart(item._id)}>edit</button>
              </li>;
      })}
    </ul>
  )
}

module.exports = ListItems;



