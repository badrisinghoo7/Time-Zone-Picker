// src/components/TimezoneList.js
import React, { useState } from 'react';
import TimezoneItem from './TimezoneItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTimezones = [
  'UTC',
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
];

const TimezoneList = () => {
  const [timezones, setTimezones] = useState(initialTimezones);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(timezones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTimezones(items);
  };

  const handleRemove = (timezone) => {
    setTimezones(timezones.filter((tz) => tz !== timezone));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="timezones">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {timezones.map((timezone, index) => (
              <Draggable key={timezone} draggableId={timezone} index={index}>
                {(provided) => (
                  <TimezoneItem
                    timezone={timezone}
                    innerRef={provided.innerRef}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    onRemove={handleRemove}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TimezoneList;
