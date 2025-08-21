import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { dateTimeDurationValidation } from '@/lib/helper';
import {
  useSendNoticeToDeviceMutation,
  useSendScheduledNoticeMutation,
} from '@/queries/devices';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DatetimeRange from '../groups/bulk-operation/datetime-range';
import DurationMinutes from '../groups/bulk-operation/duration-minutes';

const NoticeMessage = ({
  id,
  refetch,
}: {
  id: string;
  refetch?: () => void;
}) => {
  const [notice, setNotice] = useState('');
  const [durationType, setDurationType] = useState<
    'unlimited' | 'minutes' | 'datetime'
  >('unlimited');

  const [durationMinutes, setDurationMinutes] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState('12:00');
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState('12:00');
  const [sendNotice, { isLoading }] = useSendNoticeToDeviceMutation();
  const [sendScheduleNotice, { isLoading: isScheduleLoading }] =
    useSendScheduledNoticeMutation();
  const handleNoticeSubmit = async () => {
    if (!notice.trim()) {
      toast('Validation Error', {
        description: 'Please enter a notice message.',
      });
      return;
    }

    try {
      const response = dateTimeDurationValidation({
        durationType,
        durationMinutes,
        startDate,
        endDate,
        startTime,
        endTime,
      });
      if (!response) return;

      if (durationType === 'unlimited') {
        await sendNotice({
          id,
          notice,
        }).unwrap();
      } else if (durationType === 'minutes') {
        await sendNotice({
          id,
          notice,
          duration: +durationMinutes,
        }).unwrap();
      } else if (durationType === 'datetime') {
        // get unix time from startDate and StartTime
        if (!startDate || !endDate) {
          toast.error('Validation Error', {
            description: 'Please select start and end dates.',
          });
          return;
        }

        const startTimeInUnix = new Date(
          `${format(startDate, 'yyyy-MM-dd')}T${startTime}:00`
        ).getTime();
        const endTimeInUnix = new Date(
          `${format(endDate, 'yyyy-MM-dd')}T${endTime}:00`
        ).getTime();

        await sendScheduleNotice({
          id,
          notice,
          startTime: startTimeInUnix,
          endTime: endTimeInUnix,
        }).unwrap();

        refetch?.();
      }

      toast.success('Notice Sent', {
        description: `Notice message sent to device successfully.`,
      });

      setNotice('');
      setDurationType('unlimited');
      setDurationMinutes('');
      setStartDate(undefined);
      setStartTime('12:00');
      setEndDate(undefined);
      setEndTime('12:00');
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to send notice.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="text-primary h-5 w-5" />
          Notice Message Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notice">Notice Message</Label>
          <Textarea
            id="notice"
            placeholder="Enter notice message..."
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            rows={4}
          />
        </div>

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

          {durationType === 'datetime' && startDate && endDate && (
            <div className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm">
              <strong>Duration:</strong> From {format(startDate, 'PPP')} at{' '}
              {startTime} to {format(endDate, 'PPP')} at {endTime}
            </div>
          )}
        </div>

        <Button
          onClick={handleNoticeSubmit}
          disabled={isLoading || isScheduleLoading || !notice.trim()}
          className="w-full"
        >
          {isLoading || isScheduleLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending Notice...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Send Notice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoticeMessage;
