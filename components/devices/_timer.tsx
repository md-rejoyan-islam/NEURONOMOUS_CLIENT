import React, { useEffect, useRef, useState } from 'react';

// Define the types for the props of the TimeScroller component
interface TimeScrollerProps {
  label: string;
  max: number;
  value: number;
  onChange: (newValue: number) => void;
}

// Define the type for the message state
interface Message {
  text: string;
  type: string;
}

// Custom scrollable number selector component
const TimeScroller: React.FC<TimeScrollerProps> = ({
  label,
  max,
  value,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight: number = 64; // Increased height to accommodate larger font
  const fullList: number[] = [...Array(max + 1).keys()];
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalItems: number = fullList.length;
  const middleSectionIndex: number = totalItems;

  // Set the initial scroll position to the middle section
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        (value + middleSectionIndex) * itemHeight;
    }
  }, [value, middleSectionIndex, itemHeight]);

  // Handle manual scrolling with a debounce to prevent stuttering
  const handleScroll = (): void => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const currentScrollTop = containerRef.current.scrollTop;
        const newIndex = Math.round(currentScrollTop / itemHeight);
        const effectiveIndex = newIndex % totalItems;

        onChange(effectiveIndex);

        // Adjust scroll position to maintain the illusion of infinite scroll
        if (newIndex <= totalItems || newIndex >= totalItems * 2) {
          containerRef.current.scrollTop =
            (effectiveIndex + middleSectionIndex) * itemHeight;
        }
      }
    }, 150); // Debounce time
  };

  // Handle mouse wheel for stepped changes
  const handleMouseWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (e.deltaY < 0) {
      onChange((value - 1 + totalItems) % totalItems);
    } else {
      onChange((value + 1) % totalItems);
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="mb-1 text-sm font-medium text-gray-400">{label}</div>
      <div
        ref={containerRef}
        // Set height to show exactly 1 item and hide scrollbar
        className="no-scrollbar bg-primary/[0.01] relative h-20 w-32 overflow-x-hidden overflow-y-scroll scroll-smooth rounded-xl border shadow-inner"
        onScroll={handleScroll}
        onWheel={handleMouseWheel}
      >
        <div className="space-y-3">
          {[...fullList, ...fullList, ...fullList].map((num, index) => (
            <div
              key={index}
              onClick={() => onChange(num)}
              className={`flex cursor-pointer items-center justify-center font-mono text-4xl transition-all duration-150 md:text-7xl ${
                num === value
                  ? 'font-black text-slate-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {String(num).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCountingUp, setIsCountingUp] = useState<boolean>(false);
  const [hoursToSet, setHoursToSet] = useState<number>(0);
  const [minutesToSet, setMinutesToSet] = useState<number>(0);
  const [secondsToSet, setSecondsToSet] = useState<number>(0);
  const [message, setMessage] = useState<Message | null>(null);
  const [task, setTask] = useState<string>('');
  const [motivation, setMotivation] = useState<string>('');
  const [isGeneratingMotivation, setIsGeneratingMotivation] =
    useState<boolean>(false);
  const [hasBegun, setHasBegun] = useState<boolean>(false);

  // useEffect hook to handle the timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (isCountingUp) {
            return prevTime + 1;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, isCountingUp]);

  // Function to format time from seconds to HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const isNegative: boolean = totalSeconds < 0;
    const absSeconds: number = Math.abs(totalSeconds);

    const hours: number = Math.floor(absSeconds / 3600);
    const minutes: number = Math.floor((absSeconds % 3600) / 60);
    const seconds: number = absSeconds % 60;

    const pad = (num: number): string => String(num).padStart(2, '0');

    return `${isNegative ? '-' : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Function to start the timer
  const handleStart = (): void => {
    setIsRunning(true);
    setHasBegun(true);
  };

  // Function to stop the timer
  const handleStop = (): void => {
    setIsRunning(false);
  };

  // Function to reset the timer to the initial time
  const handleReset = (): void => {
    setIsRunning(false);
    setTime(initialTime);
    setHasBegun(false);
    setMotivation('');
  };

  // Function to set the timer's initial value from scrollers
  const handleSetTimer = (): void => {
    const totalSeconds: number =
      hoursToSet * 3600 + minutesToSet * 60 + secondsToSet;
    if (totalSeconds === 0 && !isCountingUp) {
      // Use a custom message box instead of alert()
      setMessage({
        text: 'Starting a countdown from 0 will result in a negative timer.',
        type: 'warning',
      });
      return;
    }
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setIsRunning(false);
    setMessage(null);
  };

  return (
    <div>
      <div className="w-full max-w-md rounded-3xl border p-8 shadow-2xl">
        {/* Message Box for validation */}
        {message && (
          <div
            className={`mb-4 rounded-xl p-4 text-center ${message.type === 'warning' ? 'bg-yellow-800 text-yellow-200' : 'bg-green-800 text-green-200'}`}
          >
            {message.text}
          </div>
        )}

        {/* Timer Controls and Settings */}
        <div className="flex flex-col space-y-4">
          {/* Scrolling Time Selectors */}
          <div className="mb-4 flex justify-center space-x-4">
            <TimeScroller
              label="Hours"
              max={23}
              value={hoursToSet}
              onChange={setHoursToSet}
            />
            <TimeScroller
              label="Minutes"
              max={59}
              value={minutesToSet}
              onChange={setMinutesToSet}
            />
            <TimeScroller
              label="Seconds"
              max={59}
              value={secondsToSet}
              onChange={setSecondsToSet}
            />
          </div>

          <button
            onClick={handleSetTimer}
            className="w-full transform rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-colors duration-200 hover:scale-105 hover:bg-blue-700"
          >
            Set Timer
          </button>

          {/* Count Up/Down Toggle */}
          <div className="mt-6 mb-4 flex items-center justify-center space-x-4">
            <span className="font-medium text-gray-400">Count Down</span>
            <div
              onClick={() => setIsCountingUp(!isCountingUp)}
              className={`flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${
                isCountingUp ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isCountingUp ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <span className="font-medium text-gray-400">Count Up</span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="mt-6 mb-8 text-center">
          <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-inner">
            <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text font-mono text-9xl font-extrabold tracking-wider text-transparent transition-colors duration-500 md:text-[12rem]">
              {formatTime(time)}
            </div>
          </div>
        </div>

        {/* Gemini API Feature */}
        <div className="mt-4 flex flex-col items-center">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What are you timing? (e.g., 'study session')"
            className="mb-4 w-full rounded-xl bg-gray-700 px-4 py-2 text-white placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {motivation && (
            <p className="animate-fadeIn mt-4 text-center text-sm text-gray-300 italic">
              {motivation}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="w-full transform rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white shadow-lg transition-colors duration-200 hover:scale-105 hover:bg-emerald-600"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full transform rounded-xl bg-red-500 px-4 py-2 font-semibold text-white shadow-lg transition-colors duration-200 hover:scale-105 hover:bg-red-600"
            >
              Stop
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-full transform rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white shadow-lg transition-colors duration-200 hover:scale-105 hover:bg-orange-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
