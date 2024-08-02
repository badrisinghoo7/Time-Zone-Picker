// src/components/TimezoneItem.js
import React from 'react';

const TimezoneItem = ({ timezone, innerRef, draggableProps, dragHandleProps, onRemove }) => (
  <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
    {timezone}
    <button onClick={() => onRemove(timezone)}>x</button>
  </div>
);

export default TimezoneItem;
