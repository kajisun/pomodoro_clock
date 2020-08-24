import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import TimeController from './TimeController';

momentDurationFormatSetup(moment);
const initSessionLength = 25 * 60,
    initBreakLength = 5 * 60;

const PomodoroTimer = () => {
    const [sessionLength, setSessionLength] = useState(initSessionLength);
    const [breakLength, setBreakLength] = useState(initBreakLength);
    const [timeLeft, setTimeLeft] = useState(sessionLength);
    const [isRunning, setIsRunnning] = useState(false);
    const [mode, setMode] = useState("session");
    const audioElement = useRef(null);

    const warningStyle = timeLeft < 60 ? {color: "red"} : {};
    
    const updateLength = (length, label) => delta => () => {
        let newLength = length + delta;
        newLength = newLength > 60 * 60 ? 60 * 60 : newLength < 60 ? 60 : newLength;
        if (!isRunning) {
            if(label === "session") {
                setSessionLength(newLength);
                if (mode === "session") {
                    setTimeLeft(newLength);
                }
            }
            if(label === "break") {
                setBreakLength(newLength);
                if (mode === "break") {
                    setTimeLeft(newLength);
                }
            }
        }
    };

    const handleReset = () => {
        setSessionLength(initSessionLength);
        setBreakLength(initBreakLength);
        setMode("session");
        setIsRunnning(false);
        setTimeLeft(initSessionLength);
        audioElement.current.pause();
        audioElement.current.currentTime = 0;
    }

    const handleRunStop = () => {
        setIsRunnning(!isRunning);
        if (mode === "") {
            setMode("session");
        }
    }

    const handleZero = () => {
        if (mode === "session") {
            setMode("break");
            setTimeLeft(breakLength);
        } else {
            setMode("session");
            setTimeLeft(sessionLength);
        }
    }

    const handleTimer = () =>  {
        const newTimeLeft = timeLeft - 1;
        if (newTimeLeft >= 0) {
            setTimeLeft(newTimeLeft);
            newTimeLeft === 0 && audioElement.current.play();
        } else {
            handleZero();
        }
    }

    const savedCallBack = useRef();

    const formattedTimeLeft = moment.duration(timeLeft, "s").format("mm:ss", { trim: false });

    useEffect(() => {
        savedCallBack.current = handleTimer;
    })

    useEffect(() => {
        const tick = () => {
            savedCallBack.current();
        }
        if (isRunning) {
            let id = setInterval(tick, 1000);
            return () => clearInterval(id);
        }
    }, [isRunning]);
    return (
        <div>
            <TimeController label={"break"} time={breakLength} updateLength={updateLength} />
            <TimeController label={"session"} time={sessionLength} updateLength={updateLength} />
            <div id="timer-label" style={warningStyle} >
                <div id="timer-label">{mode ==="session" ? "Session" : "Break" }</div>
                <div id="time-left">{formattedTimeLeft}</div>
            </div>
            <button id="start_stop" onClick={handleRunStop}>{isRunning ? "stop" : "run"}</button>
            <button id="reset" onClick={handleReset}>Reset</button>
            <audio id="beep" ref={audioElement} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" type="audio/wav"></audio>
                {!<p>test</p>}
        </div>
    );
}

export default PomodoroTimer;
