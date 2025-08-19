'use client';
import TextField from '@/components/form/text-field';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DatetimeRange from './datetime-range';
import DurationMinutes from './duration-minutes';

const NoticeType = ({
  message,
  setMessage,
  durationType,
  setDurationType,
  durationMinutes,
  setDurationMinutes,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
}: {
  message: string;
  setMessage: (message: string) => void;
  durationType: 'unlimited' | 'minutes' | 'datetime';
  setDurationType: (type: 'unlimited' | 'minutes' | 'datetime') => void;
  durationMinutes: string;
  setDurationMinutes: (minutes: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}) => {
  return (
    <>
      <TextField
        name="noticeMessage"
        label="Notice Message"
        placeholder="Enter your notice message..."
        props={{
          value: message,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value),
        }}
        error={!message ? 'Message is required' : ''}
      />

      {/* Duration Settings */}
      <div className="space-y-4">
        <Label>Display Duration</Label>
        <RadioGroup
          value={durationType}
          onValueChange={(value: 'unlimited' | 'minutes' | 'datetime') =>
            setDurationType(value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unlimited" id="unlimited" />
            <Label htmlFor="unlimited">Unlimited Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minutes" id="minutes" />
            <Label htmlFor="minutes">Duration in Minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="datetime" id="datetime" />
            <Label htmlFor="datetime">Specific Date & Time Range</Label>
          </div>
        </RadioGroup>

        {/* Minutes Input */}
        {durationType === 'minutes' && (
          <DurationMinutes
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
          />
        )}

        {/* Date Time Range */}
        {durationType === 'datetime' && (
          <DatetimeRange
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
          />
        )}
      </div>
    </>
  );
};

export default NoticeType;
