import {
  ChangeEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from 'react';

type Time = { h: number; m: number; s: number };

export default function Timer({
  onSetTime,
}: {
  onSetTime: (time: Time) => void;
}) {
  const [time, setTime] = useState<Time>({ h: 0, m: 0, s: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatValue = (val: number) => String(val).padStart(2, '0');

  const updateTime = (key: keyof Time, value: number) => {
    setTime((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const intervalId = intervalRef.current;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleWheel = (
    e: WheelEvent<HTMLInputElement>,
    key: keyof Time,
    max: number
  ) => {
    e.preventDefault();
    const step = e.deltaY > 0 ? 1 : -1;
    const value = (time[key] + step + (max + 1)) % (max + 1);
    updateTime(key, value);
    onSetTime({ ...time, [key]: value });
  };

  const handleTouch = (key: keyof Time, max: number) => {
    let startY: number | null = null;

    const onTouchStart = (e: TouchEvent<HTMLInputElement>) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent<HTMLInputElement>) => {
      if (startY === null) return;
      const diff = e.touches[0].clientY - startY;
      if (Math.abs(diff) > 15) {
        const step = diff > 0 ? 1 : -1;
        const value = (time[key] + step + (max + 1)) % (max + 1);
        updateTime(key, value);
        startY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      startY = null;
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
  };

  return (
    <div className="font-orbitron flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center space-x-8">
          {(['h', 'm', 's'] as (keyof Time)[]).map((key, idx) => {
            const max = key === 'h' ? 23 : 59;
            const labels = ['Hours', 'Minutes', 'Seconds'];
            const touch = handleTouch(key, max);
            return (
              <div key={key} className="flex flex-col items-center">
                <input
                  type="text"
                  value={formatValue(time[key])}
                  className={
                    'text-primary bg-primary/[0.01] flex h-[140px] w-[140px] appearance-none items-center justify-center rounded-md border text-center text-6xl font-bold'
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val =
                      parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    updateTime(key, Math.min(max, Math.max(0, val)));
                    onSetTime({ ...time, [key]: val });
                  }}
                  onWheel={(e) => handleWheel(e, key, max)}
                  onTouchStart={touch.onTouchStart}
                  onTouchMove={touch.onTouchMove}
                  onTouchEnd={touch.onTouchEnd}
                />
                <div className="text-muted-foreground mt-2 text-sm">
                  {labels[idx]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
