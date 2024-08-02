// src/components/ScheduleMeet.js
import React from 'react';
import moment from 'moment-timezone';

const ScheduleMeet = ({ selectedTime }) => {
  const scheduleMeet = () => {
    const endTime = moment(selectedTime).add(2, 'hours').toISOString();
    const url = `https://meet.google.com/new?start=${selectedTime.toISOString()}&end=${endTime}`;
    window.open(url, '_blank');
  };

  return <button onClick={scheduleMeet}>Schedule Meet</button>;
};

export default ScheduleMeet;
