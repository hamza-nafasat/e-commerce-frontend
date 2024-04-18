import { useEffect, useState } from "react";
import AdminAside from "../../../components/admin/AdminAside";

const Stopwatch = () => {
    const [time, setTime] = useState<number>(0);
    const [timeRunning, setTimeRunning] = useState<boolean>(false);
    // USeEFFECT FOR FRO INCREASING TIME
    // =================================
    useEffect(() => {
        let intervalID: NodeJS.Timeout;
        if (timeRunning) {
            intervalID = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            clearInterval(intervalID);
        };
    }, [timeRunning]);
    // START STOP BUTTON FUNCTION
    // ==========================
    const onStart = () => {
        setTimeRunning((prev) => !prev);
    };
    const onReset = () => {
        setTimeRunning(false);
        setTime(0);
    };
    // FUNCTION FOR MAKING HOURS PREV MINUTES AND SECONDS
    // ==================================================
    const stopwatch = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor((timeInSeconds % 3600) % 60);
        const hoursInString = String(hours).padStart(2, "0");
        const minutesInString = String(minutes).padStart(2, "0");
        const secondsInString = String(seconds).padStart(2, "0");
        return `${hoursInString} : ${minutesInString} : ${secondsInString}`;
    };
    return (
        <div className="adminContainer">
            <AdminAside />
            <main className="stopwatchContainer">
                <h2>Stopwatch</h2>
                <section>
                    <div className="stopwatch">
                        <h3>{stopwatch(time)}</h3>
                        <button onClick={onStart}>{timeRunning ? "Stop" : "Start"}</button>
                        <button onClick={onReset}>Reset</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Stopwatch;
