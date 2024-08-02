import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';


import './style.css';

// function formatTime(hours, minutes) {
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//   const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
//   return `${formattedHours}:${formattedMinutes} ${ampm}`;
// }





function TimezoneSlider({ timezone, value, onChange, onRemove, selectedDate }) {
  const [hours, minutes] = [Math.floor(value / 60), value % 60];

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // Prevent triggering onChange for range input
    onRemove(timezone);
  };

  const formatTime = (hours, minutes) => {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDateTime = () => {
    // Get the current date and time in the selected timezone
    const formattedDateTime = moment(selectedDate).tz(timezone).format('MMMM DD, YYYY');
    return formattedDateTime;
  };

  return (
    <div className="slider-wrapper">
      <div className="current-date">{formatDateTime()}</div>
      <div className="slider-header">
        <h3>{timezone}</h3>
        {timezone !== 'UTC' && (
          <button className="remove-timezone" onClick={handleRemoveClick}>
            X
          </button>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={0}
          max={24 * 60 - 1}
          step={15}
          value={value}
          onChange={handleChange}
        />
        <p className="time-display">{formatTime(hours, minutes)}</p>
      </div>
    </div>
  );
}




function App() {
  const [utcValue, setUtcValue] = useState(0);
  const [timezones, setTimezones] = useState(['IST']);
  const [values, setValues] = useState({ IST: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for dark mode
  // const [showNotification, setShowNotification] = useState(false);
  const [shareableInfo, setShareableInfo] = useState(null);

  useEffect(() => {
    const currentTime = new Date();
    const utcHours = currentTime.getUTCHours(); // UTC hours
    const utcMinutes = currentTime.getUTCMinutes(); // UTC minutes
    const utcTime = utcHours * 60 + utcMinutes;
    const istTime = utcTime + 330; // Calculate IST time based on UTC offset
    setUtcValue(utcTime);
    setValues({ IST: istTime });
    
  }, []);

  useEffect(() => {
    // Parse timezone and date/time values from the shareable link
    const url = window.location.href;
    const shareIndex = url.indexOf('/share/');
    if (shareIndex !== -1) {
      const shareInfo = url.substring(shareIndex + 7); // Get everything after '/share/'
      const [timezone, formattedDateTime] = shareInfo.split('/');
      const dateTime = decodeURIComponent(formattedDateTime.replace(/\+/g, '%20'));
      setShareableInfo({ timezone, dateTime });
    } else {
      // Handle case when the URL doesn't contain '/share/'
      // For example, if the user accesses the app directly without a shareable link
    }
  }, []);


  useEffect(() => {
    // Calculate UTC value based on the parsed shareable info
    if (shareableInfo) {
      const { timezone, dateTime } = shareableInfo;
      const utcOffsetMinutes = moment.tz.zone(timezone).utcOffset(new Date(dateTime));
      const selectedDateTime = moment.tz(dateTime, timezone).utc().valueOf();
      const utcTime = selectedDateTime - utcOffsetMinutes * 60 * 1000;
      setUtcValue(utcTime);
    }
  }, [shareableInfo]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleUtcChange = (value) => {
    setUtcValue(value);
    const newValues = {};

    for (const timezone of timezones) {
      let offsetMinutes;
      if (timezone === 'IST') {
        // For IST, use the fixed offset of UTC+5:30
        offsetMinutes = 330; // 5 hours * 60 minutes + 30 minutes
      } else {
        // For other timezones, calculate the offset based on the provided UTC value
        offsetMinutes = moment.tz.zone(timezone).utcOffset(value);
      }
      let convertedTime;
      if (timezone === 'IST') {
        convertedTime = value + offsetMinutes;
      } else {
        convertedTime = value - offsetMinutes;
      }
      // Ensure the time wraps around correctly for both cases where it exceeds 24 hours or drops below zero
      convertedTime = ((convertedTime % (24 * 60)) + (24 * 60)) % (24 * 60);
      newValues[timezone] = convertedTime;
    }
    setValues(newValues);
  };

  const handleTimezoneSelect = (timezone) => {
    if (!timezones.includes(timezone)) {
      setTimezones([...timezones, timezone]);
      const offsetMinutes = moment.tz(timezone).utcOffset();
      const convertedTime = utcValue + offsetMinutes;
      setValues({ ...values, [timezone]: convertedTime < 0 ? convertedTime + 24 * 60 : convertedTime });
    }
  };

  const handleTimezoneChange = (value, timezone) => {
    const newValues = { ...values, [timezone]: value };
    setValues(newValues);
  };

  const removeTimezone = (timezoneToRemove) => {
    setTimezones(timezones.filter((timezone) => timezone !== timezoneToRemove));
    const newValues = { ...values };
    delete newValues[timezoneToRemove]; // Remove the timezone from the values object
    setValues(newValues);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleDrop = (draggedId, droppedId) => {
    // Find the index of the dragged and dropped timezones
    const draggedIndex = timezones.indexOf(draggedId);
    const droppedIndex = timezones.indexOf(droppedId);

    // Swap the positions of the dragged and dropped timezones
    const newTimezones = [...timezones];
    const temp = newTimezones[draggedIndex];
    console.log("Dragged")
    newTimezones[draggedIndex] = newTimezones[droppedIndex];
    newTimezones[droppedIndex] = temp;

    // Update the state with the new order of timezones
    setTimezones(newTimezones);
  };

  const formatDateTime = (timezone) => {
    // Get the current date and time in the selected timezone
    const formattedDateTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    return formattedDateTime;
  };


  const handleShare = () => {
    // Format the current date and time in the selected timezone
    const dateTime = formatDateTime(timezones[0]); // Assuming the first timezone in the list is the selected timezone
  
    // Generate the shareable text
    const shareableText = `Check out the current date and time in ${timezones[0]}: ${dateTime}`;
  
    // Check if the Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: 'Share Current Date and Time',
        text: shareableText
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert('Web Share API is not supported on this browser. You can manually copy the following text to share: ' + shareableText);
    }
};


  const handleScheduleMeet = () => {
    // Get the current time in the user's timezone
    const currentTimeUserTimezone = new Date();
  
    // Add 10 hours and 55 minutes to the current time
    currentTimeUserTimezone.setHours(currentTimeUserTimezone.getHours() + 10);
    currentTimeUserTimezone.setMinutes(currentTimeUserTimezone.getMinutes() + 55);

    // Get the timezone offset in milliseconds
    const timezoneOffsetMilliseconds = currentTimeUserTimezone.getTimezoneOffset() * 60 * 1000;
  
    // Adjust the current time by the timezone offset to get the time in UTC
    const currentTimeUTC = new Date(currentTimeUserTimezone.getTime() + timezoneOffsetMilliseconds);
  
    // Calculate the end time, which is 2 hours from the current time
    const endTimeUTC = new Date(currentTimeUTC.getTime() + 2 * 60 * 60 * 1000);
  
    // Format the start and end times in the required format for Google Calendar URL
    const startTimeFormatted = currentTimeUTC.toISOString().replace(/[:\-.]/g, '').slice(0, -5);
    const endTimeFormatted = endTimeUTC.toISOString().replace(/[:\-.]/g, '').slice(0, -5);
  
    // Get the user's timezone offset
    const timezoneOffsetHours = Math.abs(Math.floor(currentTimeUserTimezone.getTimezoneOffset() / 60)).toString().padStart(2, '0');
    const timezoneOffsetMinutesRemainder = Math.abs(currentTimeUserTimezone.getTimezoneOffset() % 60).toString().padStart(2, '0');
    const timezoneOffsetSign = currentTimeUserTimezone.getTimezoneOffset() < 0 ? '+' : '-';
    const timezoneOffsetFormatted = timezoneOffsetSign + timezoneOffsetHours + timezoneOffsetMinutesRemainder;
  
    // Construct the Google Calendar event creation URL
    const googleCalendarURL = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Schedule+Meet&dates=${startTimeFormatted}/${endTimeFormatted}&ctz=${timezoneOffsetFormatted}&details=Meeting+details&location=Online`;
  
    // Redirect the user to the Google Calendar event creation page
    window.open(googleCalendarURL, '_blank');
};



  
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1 className='title'>TIMEZONE CONVERTER</h1>
        <div className="container">
          <div className="timezone-selector">
            <select onChange={(e) => handleTimezoneSelect(e.target.value)}>
              <option value="">Select Timezone</option>
              {moment.tz.names().map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
          <DatePicker placeholder="Select Date" className = 'date-picker'selected={selectedDate} onChange={handleDateChange} /> {/* Date Picker */}
          <div className="dark-mode">
            <button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
          </div>
          <div className="share-button">
            <button onClick={handleShare}>Share</button>
          </div>
  
          <div className="google-meet">
            <button onClick={handleScheduleMeet}>Schedule Meeting</button>
          </div>
        </div>
        <div className="sliders-container">
          <div className="slider-box">
            <TimezoneSlider
              timezone="UTC"
              value={utcValue}
              onChange={handleUtcChange}
              onRemove={removeTimezone}
              selectedDate={selectedDate}
            />
          
          {timezones.map((timezone, index) => (
              <TimezoneSlider
                timezone={timezone}
                value={values[timezone]}
                onChange={(value) => handleTimezoneChange(value, timezone)}
                onRemove={removeTimezone}
                selectedDate={selectedDate}
              />
          ))}
          
          </div>
        </div>
        

      </div>
    </DndProvider>
  );
}

export default App;
