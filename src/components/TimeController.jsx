import React from 'react';
import moment from 'moment';

const TimeController = ({ label, time, updateLength }) => {
    const lengthInMinutes = time / 60;
    return (
        <div>
            <p id={label + "-label"}>{label}</p>
            <button id={label + "-decrement"} onClick={updateLength(time, label)(-60)}>-</button>
            <button id={label + "-increment"} onClick={updateLength(time, label)(60)}>+</button>
            <p id={label + "-length"}>{lengthInMinutes}</p>
        </div>
    );
}

export default TimeController;
