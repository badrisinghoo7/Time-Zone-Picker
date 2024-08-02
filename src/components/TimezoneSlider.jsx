// src/components/TimezoneSlider.js
import React, { useState } from "react";
import moment from "moment-timezone";

const TimezoneSlider = () => {
  const [time, setTime] = useState(moment().tz("UTC"));

  const handleSliderChange = (event) => {
    const hours = event.target.value;
    const newTime = moment().tz("UTC").add(hours, "hours");
    setTime(newTime);
  };

  return (
    <div>
      <input
        type="range"
        min="-12"
        max="12"
        value={time.hours()}
        onChange={handleSliderChange}
      />
      <div>
        UTC: {time.format("HH:mm")} <br />
        IST: {time.clone().tz("Asia/Kolkata").format("HH:mm")}
      </div>
    </div>
  );
};

export default TimezoneSlider;
