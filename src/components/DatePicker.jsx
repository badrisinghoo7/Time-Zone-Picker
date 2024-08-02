// src/components/DatePicker.js
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';

const DatePicker = ({ timezones }) => {
  const [date, setDate] = useState(new Date());

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div>
      <ReactDatePicker selected={date} onChange={handleChange} />
      {timezones?.map((timezone) => (
        <div key={timezone}>
          {timezone}: {moment(date).tz(timezone).format('HH:mm - MMM DD')}
        </div>
      ))}
    </div>
  );
};

export default DatePicker;
